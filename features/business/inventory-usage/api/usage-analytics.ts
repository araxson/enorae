import { createSalonClient } from './salon-client'
import type {
  ProductUsageRow,
  UsageAnalytics,
  UsageTrend,
  UsageTrendRow,
} from './types'
import { fetchProductName, numberOrZero, type Client } from './usage-utils'

export async function getUsageAnalytics(startDate?: string, endDate?: string): Promise<UsageAnalytics> {
  const { supabase, salonId } = await createSalonClient()

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

  const usageData = (data ?? []) as Array<Pick<ProductUsageRow, 'product_id' | 'quantity_used' | 'cost_at_time'>>

  const totalUsage = usageData.reduce((sum, record) => sum + numberOrZero(record.quantity_used), 0)
  const totalCost = usageData.reduce(
    (sum, record) => sum + numberOrZero(record.quantity_used) * numberOrZero(record.cost_at_time),
    0,
  )
  const uniqueProducts = new Set(usageData.map((record) => record.product_id).filter(Boolean)).size
  const avgCostPerUse = usageData.length > 0 ? totalCost / usageData.length : 0

  const productMap = new Map<string, { quantity: number; cost: number; count: number }>()

  for (const record of usageData) {
    if (!record.product_id) continue
    const existing = productMap.get(record.product_id) ?? { quantity: 0, cost: 0, count: 0 }
    productMap.set(record.product_id, {
      quantity: existing.quantity + numberOrZero(record.quantity_used),
      cost: existing.cost + numberOrZero(record.quantity_used) * numberOrZero(record.cost_at_time),
      count: existing.count + 1,
    })
  }

  const topProductsData = await Promise.all(
    Array.from(productMap.entries()).map(async ([productId, stats]) => ({
      product_id: productId,
      product_name: await fetchProductName(supabase, productId),
      total_quantity: stats.quantity,
      total_cost: stats.cost,
      usage_count: stats.count,
    })),
  )

  const topProducts = topProductsData.sort((a, b) => b.total_cost - a.total_cost).slice(0, 10)

  return {
    totalUsage,
    totalCost,
    uniqueProducts,
    avgCostPerUse,
    topProducts,
  }
}

export async function getUsageTrends(days = 30): Promise<UsageTrend[]> {
  const { supabase, salonId } = await createSalonClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('product_usage')
    .select('used_at, quantity_used, cost_at_time, product_id')
    .eq('salon_id', salonId)
    .gte('used_at', startDate.toISOString())
    .order('used_at', { ascending: true })
    .returns<UsageTrendRow[]>()

  if (error) throw error

  const trendMap = new Map<string, { quantity: number; cost: number; products: Set<string> }>()
  const trendRows = data ?? []

  for (const record of trendRows) {
    if (!record.used_at) continue
    const dateKey = new Date(record.used_at).toISOString().split('T')[0]
    const existing = trendMap.get(dateKey) ?? { quantity: 0, cost: 0, products: new Set<string>() }

    existing.quantity += numberOrZero(record.quantity_used)
    existing.cost += numberOrZero(record.quantity_used) * numberOrZero(record.cost_at_time)
    if (record.product_id) existing.products.add(record.product_id)

    trendMap.set(dateKey, existing)
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
