import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type StockLevelRow = Database['public']['Views']['stock_levels']['Row']
type ProductRow = Database['public']['Views']['products']['Row']
type StockLocationRow = Database['public']['Views']['stock_locations']['Row']

export type StockLevelWithLocation = StockLevelRow & {
  product?: Pick<ProductRow, 'id' | 'name' | 'sku'> | null
  location?: Pick<StockLocationRow, 'id' | 'name'> | null
}

/**
 * Get stock levels for all products at all locations
 */
export async function getStockLevels(
  salonId: string
): Promise<StockLevelWithLocation[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('stock_levels')
    .select(
      `
        *,
        product:product_id(id, name, sku),
        location:location_id(id, name)
      `
    )
    .eq('salon_id', salonId)
    .order('updated_at', { ascending: false })

  if (error) throw error

  return (data || []) as StockLevelWithLocation[]
}

/**
 * Get stock levels grouped by product
 */
export async function getStockLevelsByProduct(
  salonId: string
): Promise<Map<string, StockLevelWithLocation[]>> {
  const stockLevels = await getStockLevels(salonId)

  const grouped = new Map<string, StockLevelWithLocation[]>()

  for (const level of stockLevels) {
    const productId = level.product_id
    if (!productId) continue

    if (!grouped.has(productId)) {
      grouped.set(productId, [])
    }

    grouped.get(productId)!.push(level)
  }

  return grouped
}
