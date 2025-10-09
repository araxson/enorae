import 'server-only'

import { createInventoryClient, requireBusinessRole, resolveAccessibleSalonIds } from './helpers'

import type { PurchaseOrderWithSupplier } from './types'

export async function getPurchaseOrders(salonId?: string, status?: string) {
  await requireBusinessRole()

  const supabase = await createInventoryClient()
  const targetSalonIds = await resolveAccessibleSalonIds(salonId)
  if (!targetSalonIds.length) {
    return []
  }

  const query = supabase
    .from('purchase_orders')
    .select(`
      *,
      supplier:suppliers(*),
      purchase_order_items(
        *,
        product:products(*)
      )
    `)
    .in('salon_id', targetSalonIds)
    .order('created_at', { ascending: false })

  if (status) {
    query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw error
  return (data || []) as PurchaseOrderWithSupplier[]
}
