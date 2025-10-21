import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// COMPLIANCE: Use public view types for SELECTs
type StockLocation = Database['public']['Views']['stock_locations']['Row']

export type StockLocationWithCounts = StockLocation & {
  product_count?: number
}

/**
 * Get all stock locations for the user's salon
 */
export async function getStockLocations(): Promise<StockLocationWithCounts[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  // Single query with nested select for stock_levels to avoid N+1 pattern
  const { data, error } = await supabase
    .from('stock_locations_view')
    .select(`
      *,
      stock_levels:stock_levels(id)
    `)
    .eq('salon_id', salonId)
    .order('name', { ascending: true })

  if (error) throw error

  // Transform to include product count from nested data
  type LocationWithStockLevels = StockLocation & {
    stock_levels?: { id: string }[]
  }
  return (data || []).map((location: LocationWithStockLevels): StockLocationWithCounts => ({
    ...location,
    product_count: location.stock_levels?.length || 0,
  }))
}

/**
 * Get single stock location by ID
 */
export async function getStockLocationById(
  id: string
): Promise<StockLocation | null> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  const { data, error } = await supabase
    .from('stock_locations_view')
    .select('*')
    .eq('id', id)
    .eq('salon_id', salonId)
    .single()

  if (error) throw error
  return data
}