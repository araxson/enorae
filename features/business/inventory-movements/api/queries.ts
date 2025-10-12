import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// Types - Use public view
type StockMovement = Database['public']['Views']['stock_movements']['Row']

export type StockMovementWithDetails = StockMovement & {
  product?: {
    id: string
    name: string
    sku: string | null
  } | null
  from_location?: {
    id: string
    name: string
  } | null
  to_location?: {
    id: string
    name: string
  } | null
  performed_by?: {
    id: string
    full_name: string | null
  } | null
}

/**
 * Get all stock movements for the user's salon
 * IMPROVED: Uses nested SELECT to eliminate N×4 pattern (401 → 1 query for 100 movements)
 */
export async function getStockMovements(limit = 100): Promise<StockMovementWithDetails[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  // ✅ FIXED: Single query with nested SELECT for all relations
  const { data, error } = await supabase
    .from('stock_movements')
    .select(`
      *,
      product:product_id(id, name, sku),
      from_location:from_location_id(id, name),
      to_location:to_location_id(id, name),
      performed_by:performed_by_id(id, full_name)
    `)
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data || []) as unknown as StockMovementWithDetails[]
}

/**
 * Get stock movements for a specific product
 * IMPROVED: Uses nested SELECT to eliminate N×4 pattern (201 → 1 query for 50 movements)
 */
export async function getStockMovementsByProduct(
  productId: string,
  limit = 50
): Promise<StockMovementWithDetails[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  // ✅ FIXED: Single query with nested SELECT for all relations
  const { data, error } = await supabase
    .from('stock_movements')
    .select(`
      *,
      product:product_id(id, name, sku),
      from_location:from_location_id(id, name),
      to_location:to_location_id(id, name),
      performed_by:performed_by_id(id, full_name)
    `)
    .eq('salon_id', salonId)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data || []) as unknown as StockMovementWithDetails[]
}

export type InventoryProductOption = {
  id: string
  name: string | null
  sku: string | null
}

export type InventoryLocationOption = {
  id: string
  name: string | null
}

export interface InventoryMovementReferences {
  products: InventoryProductOption[]
  locations: InventoryLocationOption[]
}

export async function getInventoryMovementReferences(): Promise<InventoryMovementReferences> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  const [productsResult, locationsResult] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, sku')
      .eq('salon_id', salonId)
      .eq('is_active', true)
      .order('name'),
    supabase
      .from('stock_locations')
      .select('id, name')
      .eq('salon_id', salonId)
      .order('name'),
  ])

  if (productsResult.error) throw productsResult.error
  if (locationsResult.error) throw locationsResult.error

  const products = (productsResult.data || []) as InventoryProductOption[]
  const locations = (locationsResult.data || []) as InventoryLocationOption[]

  return { products, locations }
}
