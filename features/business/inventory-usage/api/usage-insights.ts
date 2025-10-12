import { createSalonClient } from './salon-client'
import type {
  AppointmentRow,
  HighUsageProduct,
  ProductSummary,
  ProductUsageRow,
  ServiceCostAnalysis,
  StockLevelSummary,
} from './types'
import { fetchServiceName, numberOrZero } from './usage-utils'

export async function getServiceCostAnalysis(): Promise<ServiceCostAnalysis[]> {
  const { supabase, salonId } = await createSalonClient()

  const { data: usageData, error: usageError } = await supabase
    .from('product_usage')
    .select('appointment_id, quantity_used, cost_at_time')
    .eq('salon_id', salonId)
    .not('appointment_id', 'is', null)

  if (usageError) throw usageError

  const usageRows = (usageData ?? []) as Array<
    Pick<ProductUsageRow, 'appointment_id' | 'quantity_used' | 'cost_at_time'>
  >

  const appointmentIds = [...new Set(usageRows.map((usage) => usage.appointment_id).filter(Boolean))] as string[]
  if (!appointmentIds.length) {
    return []
  }

  // Note: service_id column doesn't exist in appointments view
  // Cannot perform service cost analysis without this data
  // Return empty array for now
  return []
}

export async function getHighUsageProducts(days = 30): Promise<HighUsageProduct[]> {
  const { supabase, salonId } = await createSalonClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('product_usage')
    .select('product_id, quantity_used, cost_at_time')
    .eq('salon_id', salonId)
    .gte('used_at', startDate.toISOString())

  if (error) throw error

  const productMap = new Map<string, { quantity: number; cost: number; count: number }>()
  const usageRows = (data ?? []) as Array<Pick<ProductUsageRow, 'product_id' | 'quantity_used' | 'cost_at_time'>>

  for (const record of usageRows) {
    if (!record.product_id) continue
    const existing = productMap.get(record.product_id) ?? { quantity: 0, cost: 0, count: 0 }
    productMap.set(record.product_id, {
      quantity: existing.quantity + numberOrZero(record.quantity_used),
      cost: existing.cost + numberOrZero(record.quantity_used) * numberOrZero(record.cost_at_time),
      count: existing.count + 1,
    })
  }

  const results = await Promise.all(
    Array.from(productMap.entries()).map(async ([productId, stats]) => {
      const [productResponse, stockResponse] = await Promise.all([
        supabase.from('products').select('name, sku, unit').eq('id', productId).single(),
        supabase
          .from('stock_levels')
          .select('quantity, reserved_quantity')
          .eq('product_id', productId)
          .eq('salon_id', salonId)
          .maybeSingle(),
      ])

      const productData = (productResponse.data ?? null) as (Pick<ProductSummary, 'name' | 'sku'> & { unit?: string | null }) | null
      const stockLevelData = (stockResponse?.data ?? null) as StockLevelSummary | null

      const currentQuantity = numberOrZero(stockLevelData?.quantity)
      const minimumQuantity = 0 // No minimum quantity field available
      const dailyAverage = days > 0 ? stats.quantity / days : 0
      const daysUntilReorder =
        dailyAverage > 0 ? Math.floor((currentQuantity - minimumQuantity) / dailyAverage) : 0

      return {
        product_id: productId,
        product_name: productData?.name ?? 'Unknown',
        product_sku: productData?.sku ?? null,
        product_unit: (productData as { unit?: string | null } | null)?.unit ?? null,
        total_quantity: stats.quantity,
        total_cost: stats.cost,
        usage_count: stats.count,
        daily_average: dailyAverage,
        current_stock: currentQuantity,
        minimum_stock: minimumQuantity,
        days_until_reorder: daysUntilReorder,
      }
    }),
  )

  return results.sort((a, b) => b.total_quantity - a.total_quantity)
}
