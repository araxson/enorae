import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { getUserSalonId } from '@/features/business/shared/get-user-salon'
import type { Database } from '@/lib/types/database.types'

// Types - Use schema tables (no public views exist)
type StockAlert = Database['inventory']['Tables']['stock_alerts']['Row']

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
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon_id (either as owner or staff)
  const salonId = await getUserSalonId(session.user.id)

  if (!salonId) throw new Error('User salon not found')

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
    .eq('products.salon_id', salonId)
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
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon_id (either as owner or staff)
  const salonId = await getUserSalonId(session.user.id)

  if (!salonId) throw new Error('User salon not found')

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
    .eq('products.salon_id', salonId)
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
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon_id (either as owner or staff)
  const salonId = await getUserSalonId(session.user.id)

  if (!salonId) throw new Error('User salon not found')

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
    .eq('products.salon_id', salonId)
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
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon_id (either as owner or staff)
  const salonId = await getUserSalonId(session.user.id)

  if (!salonId) throw new Error('User salon not found')

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
    .eq('products.salon_id', salonId)
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
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon_id (either as owner or staff)
  const salonId = await getUserSalonId(session.user.id)

  if (!salonId) throw new Error('User salon not found')

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
  const alertData = data as StockAlertWithProduct & { product?: { salon_id?: string } }
  if (alertData.product?.salon_id !== salonId) {
    throw new Error('Unauthorized: Alert not found for your salon')
  }

  return data as StockAlertWithProduct
}
