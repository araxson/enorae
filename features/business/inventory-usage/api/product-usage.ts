import type { ProductUsageRow, ProductUsageWithDetails } from './types'
import { createSalonClient } from './salon-client'
import { enrichUsageRecords } from './usage-records'

export async function getProductUsage(limit = 100): Promise<ProductUsageWithDetails[]> {
  const { supabase, salonId } = await createSalonClient()

  const { data, error } = await supabase
    .from('product_usage')
    .select('*')
    .eq('salon_id', salonId)
    .order('used_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  const usageRecords = (data ?? []) as ProductUsageRow[]
  return enrichUsageRecords(supabase, usageRecords)
}

export async function getProductUsageByProduct(
  productId: string,
  limit = 50,
): Promise<ProductUsageWithDetails[]> {
  const { supabase, salonId } = await createSalonClient()

  const { data, error } = await supabase
    .from('product_usage')
    .select('*')
    .eq('salon_id', salonId)
    .eq('product_id', productId)
    .order('used_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  const usageRecords = (data ?? []) as ProductUsageRow[]
  return enrichUsageRecords(supabase, usageRecords)
}
