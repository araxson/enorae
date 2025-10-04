import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// Types - Use schema tables (no public view exists)
type StockLocation = Database['inventory']['Tables']['stock_locations']['Row']

export type StockLocationWithCounts = StockLocation & {
  product_count?: number
}

/**
 * Get all stock locations for the user's salon
 */
export async function getStockLocations(): Promise<StockLocationWithCounts[]> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('stock_locations')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
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
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('stock_locations')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}
