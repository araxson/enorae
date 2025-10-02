import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Types
type StockAlert = Database['public']['Views']['stock_alerts']['Row']
type Product = Database['public']['Views']['products']['Row']
type StockLocation = Database['public']['Views']['stock_locations']['Row']

export type StockAlertWithProduct = StockAlert & {
  product: {
    id: string
    name: string
    sku: string | null
    unit_of_measure: string | null
  } | null
  location: {
    id: string
    name: string
  } | null
}

/**
 * Get all stock alerts for the user's salon
 */
export async function getStockAlerts(): Promise<StockAlertWithProduct[]> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Get user's salon_id from staff_profiles
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // Query stock alerts with product details
  const { data, error } = await supabase
    .from('stock_alerts')
    .select(`
      *,
      product:products!fk_stock_alerts_product(
        id,
        name,
        sku,
        unit_of_measure
      ),
      location:stock_locations!stock_alerts_location_id_fkey(
        id,
        name
      )
    `)
    .eq('products.salon_id', staffProfile.salon_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StockAlertWithProduct[]
}

/**
 * Get unresolved stock alerts for the user's salon
 */
export async function getUnresolvedStockAlerts(): Promise<StockAlertWithProduct[]> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Get user's salon_id from staff_profiles
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // Query unresolved alerts
  const { data, error } = await supabase
    .from('stock_alerts')
    .select(`
      *,
      product:products!fk_stock_alerts_product(
        id,
        name,
        sku,
        unit_of_measure
      ),
      location:stock_locations!stock_alerts_location_id_fkey(
        id,
        name
      )
    `)
    .eq('products.salon_id', staffProfile.salon_id)
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StockAlertWithProduct[]
}

/**
 * Get stock alerts by type
 */
export async function getStockAlertsByType(
  alertType: string
): Promise<StockAlertWithProduct[]> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Get user's salon_id from staff_profiles
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // Query alerts by type
  const { data, error } = await supabase
    .from('stock_alerts')
    .select(`
      *,
      product:products!fk_stock_alerts_product(
        id,
        name,
        sku,
        unit_of_measure
      ),
      location:stock_locations!stock_alerts_location_id_fkey(
        id,
        name
      )
    `)
    .eq('products.salon_id', staffProfile.salon_id)
    .eq('alert_type', alertType)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StockAlertWithProduct[]
}

/**
 * Get stock alerts by level
 */
export async function getStockAlertsByLevel(
  alertLevel: string
): Promise<StockAlertWithProduct[]> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Get user's salon_id from staff_profiles
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // Query alerts by level
  const { data, error } = await supabase
    .from('stock_alerts')
    .select(`
      *,
      product:products!fk_stock_alerts_product(
        id,
        name,
        sku,
        unit_of_measure
      ),
      location:stock_locations!stock_alerts_location_id_fkey(
        id,
        name
      )
    `)
    .eq('products.salon_id', staffProfile.salon_id)
    .eq('alert_level', alertLevel)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StockAlertWithProduct[]
}

/**
 * Get single stock alert by ID
 */
export async function getStockAlertById(
  id: string
): Promise<StockAlertWithProduct | null> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Get user's salon_id from staff_profiles
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // Query single alert
  const { data, error } = await supabase
    .from('stock_alerts')
    .select(`
      *,
      product:products!fk_stock_alerts_product(
        id,
        name,
        sku,
        unit_of_measure,
        salon_id
      ),
      location:stock_locations!stock_alerts_location_id_fkey(
        id,
        name
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error

  // Verify ownership via product salon_id
  if (data.product?.salon_id !== staffProfile.salon_id) {
    throw new Error('Unauthorized: Alert not found for your salon')
  }

  return data as StockAlertWithProduct
}
