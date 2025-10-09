'use server'

import { revalidatePath } from 'next/cache'
import { UUID_REGEX } from '../utils/schemas'
import { getSupabaseClient, requireBusinessSession, requireSalonId } from '../utils/supabase'

export async function receivePurchaseOrderItems(formData: FormData) {
  try {
    const orderId = formData.get('orderId')?.toString()
    const itemsJson = formData.get('items')?.toString()

    if (!orderId || !UUID_REGEX.test(orderId)) return { error: 'Invalid order ID' }
    if (!itemsJson) return { error: 'No items provided' }

    const items = JSON.parse(itemsJson) as Array<{ id: string; quantityReceived: number }>

    const supabase = await getSupabaseClient()
    const session = await requireBusinessSession()
    const salonId = await requireSalonId()

    const { data: order } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .select('id')
      .eq('id', orderId)
      .eq('salon_id', salonId)
      .single()

    if (!order) return { error: 'Purchase order not found' }

    for (const item of items) {
      if (!UUID_REGEX.test(item.id) || item.quantityReceived < 0) continue

      const { error: updateError } = await supabase
        .schema('inventory')
        .from('purchase_order_items')
        .update({
          quantity_received: item.quantityReceived,
          received_at: item.quantityReceived > 0 ? new Date().toISOString() : null,
        })
        .eq('id', item.id)
        .eq('purchase_order_id', orderId)

      if (updateError) return { error: `Failed to update item: ${updateError.message}` }
    }

    const { data: allItems } = await supabase
      .schema('inventory')
      .from('purchase_order_items')
      .select('quantity_ordered, quantity_received')
      .eq('purchase_order_id', orderId)

    const allReceived = allItems?.every(
      (item) => item.quantity_received !== null && item.quantity_received >= (item.quantity_ordered || 0)
    )

    if (allReceived) {
      await supabase
        .schema('inventory')
        .from('purchase_orders')
        .update({
          status: 'received',
          actual_delivery_date: new Date().toISOString(),
          updated_by_id: session.user.id,
        })
        .eq('id', orderId)
        .eq('salon_id', salonId)
    }

    revalidatePath('/business/inventory/purchase-orders')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to receive items' }
  }
}
