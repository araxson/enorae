import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { UUID_REGEX } from '../utils/schemas'
import { getSupabaseClient, requireBusinessSession, requireSalonId } from '../utils/supabase'

const receiveItemsSchema = z.object({
  orderId: z.string().regex(UUID_REGEX, 'Invalid order ID'),
  items: z
    .array(
      z.object({
        id: z.string().regex(UUID_REGEX, 'Invalid item ID'),
        quantityReceived: z
          .coerce.number({ invalid_type_error: 'Quantity received must be a number' })
          .int('Quantity received must be a whole number')
          .min(0, 'Quantity received cannot be negative'),
      }),
    )
    .min(1, 'You must provide at least one item to receive'),
})

function getValidationErrorMessage(error: z.ZodError): string {
  return error.errors[0]?.message ?? 'Invalid request payload'
}

export async function receivePurchaseOrderItemsMutation(formData: FormData) {
  try {
    const rawOrderId = formData.get('orderId')
    const rawItems = formData.get('items')

    if (!rawOrderId) return { error: 'Order ID is required' }
    if (!rawItems) return { error: 'No items provided' }

    let parsedItems: unknown
    try {
      parsedItems = JSON.parse(rawItems.toString())
    } catch {
      return { error: 'Items payload must be valid JSON' }
    }

    const payloadResult = receiveItemsSchema.safeParse({
      orderId: rawOrderId.toString(),
      items: parsedItems,
    })

    if (!payloadResult.success) {
      return { error: getValidationErrorMessage(payloadResult.error) }
    }

    const { orderId, items } = payloadResult.data

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
      const { error: updateError } = await supabase
        .schema('inventory')
        .from('purchase_order_items')
        .update({
          quantity_received: item.quantityReceived,
          received_at: item.quantityReceived > 0 ? new Date().toISOString() : null,
        })
        .eq('id', item.id)
        .eq('purchase_order_id', orderId)

      if (updateError) {
        return { error: `Failed to update item: ${updateError.message}` }
      }
    }

    const { data: allItems } = await supabase
      .schema('inventory')
      .from('purchase_order_items')
      .select('quantity_ordered, quantity_received')
      .eq('purchase_order_id', orderId)

    const allReceived = allItems?.every((item) => {
      const ordered = item.quantity_ordered ?? 0
      const received = item.quantity_received ?? 0
      return received >= ordered
    })

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
