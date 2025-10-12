import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

interface CouponValidationResult {
  is_valid: boolean
  discount_amount: number
  discount_type: string
  error_message?: string
}

type CouponRow = {
  id: string
  salon_id: string
  code: string
  description: string | null
  discount_type: string
  discount_value: number
  max_discount_amount: number | null
  is_active: boolean
  valid_from: string | null
  valid_until: string | null
  max_uses: number | null
  max_uses_per_customer: number | null
  min_purchase_amount: number | null
  applicable_services: string[] | null
  applicable_customer_ids: string[] | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

type CouponUsageRow = {
  id: string
  coupon_id: string
  coupon_code: string
  customer_id: string
  appointment_id: string | null
  discount_amount: number
  created_at: string
}

export type CouponWithStats = CouponRow & {
  stats: {
    totalUses: number
    uniqueCustomers: number
    totalDiscount: number
    averageDiscount: number
    lastUsedAt: string | null
  }
}

export type CouponAnalyticsSnapshot = {
  coupons: CouponWithStats[]
  usage: CouponUsageRow[]
}

export async function validateCoupon(
  couponCode: string,
  salonId: string,
  customerId: string,
  amount: number
): Promise<CouponValidationResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('validate_coupon', {
      p_coupon_code: couponCode,
      p_salon_id: salonId,
      p_customer_id: customerId,
      p_amount: amount,
    })
    .single()

  if (error) throw error
  return data as CouponValidationResult
}

export async function getCouponAnalytics(salonId: string): Promise<CouponAnalyticsSnapshot> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('catalog_coupons')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error

  const coupons = (data || []) as CouponRow[]
  if (coupons.length === 0) {
    return {
      coupons: [],
      usage: [],
    }
  }

  const { data: usageRows, error: usageError } = await supabase
    .from('catalog_coupon_usage')
    .select('coupon_id, coupon_code, customer_id, discount_amount, created_at, appointment_id')
    .in(
      'coupon_id',
      coupons.map((coupon) => coupon.id)
    )

  if (usageError) throw usageError

  const usage = (usageRows || []) as CouponUsageRow[]
  const statsMap = new Map<string, CouponWithStats['stats']>()

  for (const coupon of coupons) {
    statsMap.set(coupon.id, {
      totalUses: 0,
      uniqueCustomers: 0,
      totalDiscount: 0,
      averageDiscount: 0,
      lastUsedAt: null,
    })
  }

  usage.forEach((entry) => {
    const stats = statsMap.get(entry.coupon_id)
    if (!stats) return

    stats.totalUses += 1
    stats.totalDiscount += Number(entry.discount_amount || 0)
    stats.lastUsedAt =
      !stats.lastUsedAt || (entry.created_at && entry.created_at > stats.lastUsedAt)
        ? entry.created_at
        : stats.lastUsedAt
  })

  // Compute unique customers and averages
  const uniqueCustomersByCoupon = usage.reduce<Record<string, Set<string>>>((acc, entry) => {
    if (!entry.coupon_id || !entry.customer_id) return acc
    if (!acc[entry.coupon_id]) {
      acc[entry.coupon_id] = new Set<string>()
    }
    acc[entry.coupon_id].add(entry.customer_id)
    return acc
  }, {})

  statsMap.forEach((stats, couponId) => {
    const uniqueCount = uniqueCustomersByCoupon[couponId]?.size ?? 0
    stats.uniqueCustomers = uniqueCount
    stats.averageDiscount = stats.totalUses > 0 ? stats.totalDiscount / stats.totalUses : 0
  })

  const enrichedCoupons = coupons.map((coupon) => ({
    ...coupon,
    stats: statsMap.get(coupon.id) ?? {
      totalUses: 0,
      uniqueCustomers: 0,
      totalDiscount: 0,
      averageDiscount: 0,
      lastUsedAt: null,
    },
  }))

  return {
    coupons: enrichedCoupons,
    usage,
  }
}

export async function getCouponUsageStats(couponId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('catalog_coupon_usage')
    .select('*')
    .eq('coupon_id', couponId)

  if (error) throw error

  const usageEntries = (data ?? []) as CouponUsageRow[]

  return {
    total_uses: usageEntries.length,
    unique_customers: new Set(usageEntries.map((u) => u.customer_id).filter(Boolean)).size,
    total_discount: usageEntries.reduce(
      (sum, u) => sum + Number(u.discount_amount || 0),
      0
    ),
  }
}

export function buildCouponEffectiveness(analytics: CouponAnalyticsSnapshot) {
  const { coupons, usage } = analytics

  const totalDiscount = coupons.reduce((sum, coupon) => sum + coupon.stats.totalDiscount, 0)
  const totalUses = coupons.reduce((sum, coupon) => sum + coupon.stats.totalUses, 0)
  const activeCoupons = coupons.filter((coupon) => coupon.is_active && !coupon.deleted_at)
  const expiringSoon = coupons.filter((coupon) => {
    if (!coupon.valid_until) return false
    const daysUntilExpiry =
      (new Date(coupon.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7
  })

  const topCoupon = coupons.slice().sort((a, b) => b.stats.totalDiscount - a.stats.totalDiscount)[0] || null

  const usageByDay = usage.reduce<Record<string, { uses: number; discount: number }>>((acc, entry) => {
    if (!entry.created_at) return acc
    const day = entry.created_at.split('T')[0]
    const bucket = acc[day] ?? { uses: 0, discount: 0 }
    bucket.uses += 1
    bucket.discount += Number(entry.discount_amount || 0)
    acc[day] = bucket
    return acc
  }, {})

  const trend = Object.entries(usageByDay)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, value]) => ({
      date,
      uses: value.uses,
      discount: value.discount,
    }))

  return {
    totals: {
      totalDiscount,
      totalUses,
      activeCoupons: activeCoupons.length,
      averageDiscount: totalUses > 0 ? totalDiscount / totalUses : 0,
    },
    topCoupon,
    expiringSoon,
    trend,
  }
}
