import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { StockLevelWithLocation } from '../../products/api/stock-queries'

type StockLocation = Database['public']['Views']['stock_locations']['Row']

/**
 * Get user's salon
 * SECURITY: Business users only
 */
async function getUserSalon() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  return { id: salonId }
}

/**
 * Get stock levels for all products at all locations
 * SECURITY: Business users only
 */
export async function getStockLevels(): Promise<StockLevelWithLocation[]> {
  const salon = await getUserSalon()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('stock_levels')
    .select('*')
    .eq('salon_id', salon.id)
    .order('product_name', { ascending: true })

  if (error) throw error
  return (data || []) as StockLevelWithLocation[]
}

/**
 * Get stock locations for the salon
 * SECURITY: Business users only
 */
export async function getStockLocations(): Promise<StockLocation[]> {
  const salon = await getUserSalon()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('stock_locations')
    .select('*')
    .eq('salon_id', salon.id)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}
