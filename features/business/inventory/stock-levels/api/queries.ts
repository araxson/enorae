import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type StockLevel = Database['public']['Views']['stock_levels']['Row']
type StockLocation = Database['public']['Views']['stock_locations']['Row']

export type StockLevelWithLocation = StockLevel & {
  location_name?: string | null
}

/**
 * Get user's salon
 * SECURITY: Business users only
 */
async function getUserSalon() {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) {
    throw new Error('Salon not found')
  }

  return { id: staffProfile.salon_id }
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
