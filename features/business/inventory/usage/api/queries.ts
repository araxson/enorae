import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// COMPLIANCE: Use public view types for SELECTs
type ProductUsage = Database['public']['Views']['product_usage']['Row']

export type ProductUsageWithDetails = ProductUsage & {
  product?: {
    id: string
    name: string
    sku: string | null
  } | null
  appointment?: {
    id: string
    scheduled_at: string
  } | null
  staff?: {
    id: string
    full_name: string | null
  } | null
}

/**
 * Get product usage records for the user's salon
 */
export async function getProductUsage(limit = 100): Promise<ProductUsageWithDetails[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_usage')
    .select('*')
    .eq('salon_id', salonId)
    .order('used_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  // Get related data for each usage record
  const usageWithDetails = await Promise.all(
    (data || []).map(async (usage: ProductUsage) => {
      // Get product
      const { data: product } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', usage.product_id!)
        .single()

      // Get appointment if exists
      let appointment = null
      if (usage.appointment_id) {
        const { data: apt } = await supabase
          .from('appointments')
          .select('id, scheduled_at')
          .eq('id', usage.appointment_id)
          .single()
        appointment = apt
      }

      // Get staff if exists
      let staff = null
      if (usage.performed_by_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', usage.performed_by_id)
          .single()
        staff = profile
      }

      return {
        ...usage,
        product,
        appointment,
        staff,
      }
    })
  )

  return usageWithDetails
}

/**
 * Get product usage for a specific product
 */
export async function getProductUsageByProduct(
  productId: string,
  limit = 50
): Promise<ProductUsageWithDetails[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_usage')
    .select('*')
    .eq('salon_id', salonId)
    .eq('product_id', productId)
    .order('used_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  const usageWithDetails = await Promise.all(
    (data || []).map(async (usage: ProductUsage) => {
      const { data: product } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', usage.product_id!)
        .single()

      let appointment = null
      if (usage.appointment_id) {
        const { data: apt } = await supabase
          .from('appointments')
          .select('id, scheduled_at')
          .eq('id', usage.appointment_id)
          .single()
        appointment = apt
      }

      let staff = null
      if (usage.performed_by_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', usage.performed_by_id)
          .single()
        staff = profile
      }

      return {
        ...usage,
        product,
        appointment,
        staff,
      }
    })
  )

  return usageWithDetails
}

export interface UsageAnalytics {
  totalUsage: number
  totalCost: number
  uniqueProducts: number
  avgCostPerUse: number
  topProducts: {
    product_id: string
    product_name: string
    total_quantity: number
    total_cost: number
    usage_count: number
  }[]
}

export interface UsageTrend {
  date: string
  total_quantity: number
  total_cost: number
  product_count: number
}

export interface ServiceCostAnalysis {
  service_id: string
  service_name: string
  total_appointments: number
  total_product_cost: number
  avg_cost_per_service: number
}

/**
 * Get usage analytics for the salon
 */
export async function getUsageAnalytics(
  startDate?: string,
  endDate?: string
): Promise<UsageAnalytics> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  let query = supabase
    .from('product_usage')
    .select('product_id, quantity_used, cost_at_time')
    .eq('salon_id', salonId)

  if (startDate) {
    query = query.gte('used_at', startDate)
  }

  if (endDate) {
    query = query.lte('used_at', endDate)
  }

  const { data, error } = await query

  if (error) throw error

  const usageData = data || []

  // Calculate totals
  const totalUsage = usageData.reduce((sum, r) => sum + (Number(r.quantity_used) || 0), 0)
  const totalCost = usageData.reduce(
    (sum, r) => sum + (Number(r.quantity_used) || 0) * (Number(r.cost_at_time) || 0),
    0
  )
  const uniqueProducts = new Set(usageData.map((r) => r.product_id).filter(Boolean)).size
  const avgCostPerUse = usageData.length > 0 ? totalCost / usageData.length : 0

  // Calculate top products
  const productMap = new Map<
    string,
    { quantity: number; cost: number; count: number }
  >()

  for (const record of usageData) {
    if (!record.product_id) continue

    const existing = productMap.get(record.product_id) || {
      quantity: 0,
      cost: 0,
      count: 0,
    }
    productMap.set(record.product_id, {
      quantity: existing.quantity + (Number(record.quantity_used) || 0),
      cost:
        existing.cost + (Number(record.quantity_used) || 0) * (Number(record.cost_at_time) || 0),
      count: existing.count + 1,
    })
  }

  // Fetch product names
  const topProductsData = await Promise.all(
    Array.from(productMap.entries()).map(async ([productId, stats]) => {
      const { data: product } = await supabase
        .from('products')
        .select('name')
        .eq('id', productId)
        .single()

      return {
        product_id: productId,
        product_name: product?.name || 'Unknown',
        total_quantity: stats.quantity,
        total_cost: stats.cost,
        usage_count: stats.count,
      }
    })
  )

  const topProducts = topProductsData
    .sort((a, b) => b.total_cost - a.total_cost)
    .slice(0, 10)

  return {
    totalUsage,
    totalCost,
    uniqueProducts,
    avgCostPerUse,
    topProducts,
  }
}

/**
 * Get usage trends over time
 */
export async function getUsageTrends(days: number = 30): Promise<UsageTrend[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('product_usage')
    .select('used_at, quantity_used, cost_at_time, product_id')
    .eq('salon_id', salonId)
    .gte('used_at', startDate.toISOString())
    .order('used_at', { ascending: true })

  if (error) throw error

  // Group by date
  const trendMap = new Map<string, { quantity: number; cost: number; products: Set<string> }>()

  for (const record of data || []) {
    const date = new Date(record.used_at || '').toISOString().split('T')[0]
    const existing = trendMap.get(date) || { quantity: 0, cost: 0, products: new Set() }

    existing.quantity += Number(record.quantity_used) || 0
    existing.cost += (Number(record.quantity_used) || 0) * (Number(record.cost_at_time) || 0)
    if (record.product_id) existing.products.add(record.product_id)

    trendMap.set(date, existing)
  }

  return Array.from(trendMap.entries())
    .map(([date, stats]) => ({
      date,
      total_quantity: stats.quantity,
      total_cost: stats.cost,
      product_count: stats.products.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Get service cost analysis
 */
export async function getServiceCostAnalysis(): Promise<ServiceCostAnalysis[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  // Get all usage with appointment service info
  const { data: usageData, error: usageError } = await supabase
    .from('product_usage')
    .select(`
      appointment_id,
      quantity_used,
      cost_at_time
    `)
    .eq('salon_id', salonId)
    .not('appointment_id', 'is', null)

  if (usageError) throw usageError

  // Get appointments with services
  const appointmentIds = [...new Set(usageData?.map((u) => u.appointment_id).filter(Boolean))]

  if (appointmentIds.length === 0) {
    return []
  }

  const { data: appointments, error: apptError } = await supabase
    .from('appointments')
    .select('id, service_id')
    .in('id', appointmentIds)

  if (apptError) throw apptError

  // Group by service
  const serviceMap = new Map<
    string,
    { appointments: Set<string>; totalCost: number }
  >()

  for (const usage of usageData || []) {
    const appointment = appointments?.find((a) => a.id === usage.appointment_id)
    if (!appointment?.service_id) continue

    const cost =
      (Number(usage.quantity_used) || 0) * (Number(usage.cost_at_time) || 0)

    const existing = serviceMap.get(appointment.service_id) || {
      appointments: new Set(),
      totalCost: 0,
    }

    existing.appointments.add(appointment.id)
    existing.totalCost += cost
    serviceMap.set(appointment.service_id, existing)
  }

  // Fetch service names and calculate averages
  const analysis = await Promise.all(
    Array.from(serviceMap.entries()).map(async ([serviceId, stats]) => {
      const { data: service } = await supabase
        .from('services')
        .select('name')
        .eq('id', serviceId)
        .single()

      return {
        service_id: serviceId,
        service_name: service?.name || 'Unknown',
        total_appointments: stats.appointments.size,
        total_product_cost: stats.totalCost,
        avg_cost_per_service: stats.appointments.size > 0 ? stats.totalCost / stats.appointments.size : 0,
      }
    })
  )

  return analysis.sort((a, b) => b.total_product_cost - a.total_product_cost)
}

/**
 * Get high-usage products (for inventory optimization)
 */
export async function getHighUsageProducts(days: number = 30) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('product_usage')
    .select('product_id, quantity_used, cost_at_time')
    .eq('salon_id', salonId)
    .gte('used_at', startDate.toISOString())

  if (error) throw error

  // Group by product
  const productMap = new Map<string, { quantity: number; cost: number; count: number }>()

  for (const record of data || []) {
    if (!record.product_id) continue

    const existing = productMap.get(record.product_id) || { quantity: 0, cost: 0, count: 0 }
    productMap.set(record.product_id, {
      quantity: existing.quantity + (Number(record.quantity_used) || 0),
      cost:
        existing.cost + (Number(record.quantity_used) || 0) * (Number(record.cost_at_time) || 0),
      count: existing.count + 1,
    })
  }

  // Fetch product details and stock levels
  const highUsageProducts = await Promise.all(
    Array.from(productMap.entries()).map(async ([productId, stats]) => {
      const [product, stockLevel] = await Promise.all([
        supabase.from('products').select('name, sku, unit').eq('id', productId).single(),
        supabase
          .from('stock_levels')
          .select('current_quantity, minimum_quantity')
          .eq('product_id', productId)
          .eq('salon_id', salonId)
          .maybeSingle(),
      ])

      const dailyAverage = stats.quantity / days

      return {
        product_id: productId,
        product_name: product.data?.name || 'Unknown',
        product_sku: product.data?.sku || null,
        product_unit: product.data?.unit || null,
        total_quantity: stats.quantity,
        total_cost: stats.cost,
        usage_count: stats.count,
        daily_average: dailyAverage,
        current_stock: Number(stockLevel?.data?.current_quantity) || 0,
        minimum_stock: Number(stockLevel?.data?.minimum_quantity) || 0,
        days_until_reorder: stockLevel?.data?.current_quantity
          ? Math.floor((Number(stockLevel.data.current_quantity) - (Number(stockLevel.data.minimum_quantity) || 0)) / dailyAverage)
          : 0,
      }
    })
  )

  return highUsageProducts.sort((a, b) => b.total_quantity - a.total_quantity)
}
