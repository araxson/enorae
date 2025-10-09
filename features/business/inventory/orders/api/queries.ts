import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// COMPLIANCE: Use public view types for SELECTs
type PurchaseOrder = Database['public']['Views']['purchase_orders']['Row']
type PurchaseOrderItem = Database['public']['Views']['purchase_order_items']['Row']

export type PurchaseOrderWithDetails = PurchaseOrder & {
  supplier?: {
    id: string
    name: string
  } | null
  items?: (PurchaseOrderItem & {
    product?: {
      id: string
      name: string
      sku: string | null
    } | null
  })[]
}

/**
 * Get all purchase orders for the user's salon
 */
export async function getPurchaseOrders(): Promise<PurchaseOrderWithDetails[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  // PERFORMANCE: Use join syntax to fetch all related data in single query (eliminates N+1)
  const { data, error } = await supabase
    .from('purchase_orders')
    .select(`
      *,
      supplier:supplier_id(id, name),
      items:purchase_order_items(
        *,
        product:product_id(id, name, sku)
      )
    `)
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []) as PurchaseOrderWithDetails[]
}

/**
 * Get single purchase order by ID
 */
export async function getPurchaseOrderById(
  id: string
): Promise<PurchaseOrderWithDetails | null> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const { data: order, error } = await supabase
    .from('purchase_orders')
    .select(`
      *,
      supplier:supplier_id(id, name),
      items:purchase_order_items(
        *,
        product:product_id(id, name, sku)
      )
    `)
    .eq('id', id)
    .single<PurchaseOrderWithDetails>()

  if (error) throw error
  if (!order?.salon_id || !(await canAccessSalon(order.salon_id))) {
    throw new Error('Purchase order not found')
  }

  return order
}
