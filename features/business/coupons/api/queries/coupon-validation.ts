import 'server-only'
import { COUPONS_UNSUPPORTED_MESSAGE } from '@/features/business/coupons/api/messages'
import { createOperationLogger } from '@/lib/observability/logger'

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
  const logger = createOperationLogger('validateCoupon', {})
  logger.start()

  return {
    is_valid: false,
    discount_amount: 0,
    discount_type: 'unsupported',
    error_message: COUPONS_UNSUPPORTED_MESSAGE,
  }
}

export async function getCouponAnalytics(salonId: string): Promise<CouponAnalyticsSnapshot> {
  return {
    coupons: [],
    usage: [],
  }
}

export async function getCouponUsageStats(couponId: string) {
  return {
    total_uses: 0,
    unique_customers: 0,
    total_discount: 0,
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
    if (!day) return acc
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
