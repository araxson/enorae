import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// Types - Use schema tables (no public views exist)
type PurchaseOrder = Database['inventory']['Tables']['purchase_orders']['Row']
type PurchaseOrderItem = Database['inventory']['Tables']['purchase_order_items']['Row']

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
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

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
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
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
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // PERFORMANCE: Use join syntax to fetch all related data in single query
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
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .single<PurchaseOrderWithDetails>()

  if (error) throw error
  if (!data) throw new Error('Purchase order not found')

  return data
}
