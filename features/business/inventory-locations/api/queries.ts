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

  const { data, error } = await supabase
    .from('stock_locations')
    .select('*')
    .eq('salon_id', salonId)
    .order('name', { ascending: true })

  if (error) throw error

  // Get product counts for each location
  const locationsWithCounts = await Promise.all(
    (data || []).map(async (location: StockLocation) => {
      const { count } = await supabase
        .from('stock_levels')
        .select('*', { count: 'exact', head: true })
        .eq('location_id', location.id!)

      return {
        ...location,
        product_count: count || 0,
      }
    })
  )

  return locationsWithCounts
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
    .from('stock_locations')
    .select('*')
    .eq('id', id)
    .eq('salon_id', salonId)
    .single()

  if (error) throw error
  return data
}