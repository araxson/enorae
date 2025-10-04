import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type StockLevel = Database['public']['Views']['stock_levels']['Row']

export type StockLevelWithLocation = StockLevel & {
  location_name?: string | null
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
    .select('*')
    .eq('salon_id', salonId)
    .order('product_name', { ascending: true })

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
