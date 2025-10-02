import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: purchase_orders and purchase_order_items don't have public views yet

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
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Get supplier and items for each order
  const ordersWithDetails = await Promise.all(
    (data || []).map(async (order) => {
      // Get supplier
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('id', order.supplier_id!)
        .single()

      // Get items with products
      const { data: items } = await supabase
        .from('purchase_order_items')
        .select('*')
        .eq('purchase_order_id', order.id)

      const itemsWithProducts = await Promise.all(
        (items || []).map(async (item) => {
          const { data: product } = await supabase
            .from('products')
            .select('id, name, sku')
            .eq('id', item.product_id)
            .single()

          return {
            ...item,
            product,
          }
        })
      )

      return {
        ...order,
        supplier,
        items: itemsWithProducts,
      }
    })
  )

  return ordersWithDetails
}

/**
 * Get single purchase order by ID
 */
export async function getPurchaseOrderById(
  id: string
): Promise<PurchaseOrderWithDetails | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .single()

  if (error) throw error

  // Get supplier
  const { data: supplier } = await supabase
    .from('suppliers')
    .select('id, name')
    .eq('id', data.supplier_id!)
    .single()

  // Get items with products
  const { data: items } = await supabase
    .from('purchase_order_items')
    .select('*')
    .eq('purchase_order_id', data.id)

  const itemsWithProducts = await Promise.all(
    (items || []).map(async (item) => {
      const { data: product } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', item.product_id)
        .single()

      return {
        ...item,
        product,
      }
    })
  )

  return {
    ...data,
    supplier,
    items: itemsWithProducts,
  }
}
