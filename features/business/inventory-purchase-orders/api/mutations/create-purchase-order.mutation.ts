import { revalidatePath } from 'next/cache'
import { orderSchema } from '../utils/schemas'
import { getSupabaseClient, requireBusinessSession, requireSalonId } from '../utils/supabase'

export async function createPurchaseOrderMutation(formData: FormData) {
  try {
    const itemsJson = formData.get('items')?.toString()
    const items = itemsJson ? JSON.parse(itemsJson) : []

    const result = orderSchema.safeParse({
      supplierId: formData.get('supplierId'),
      orderDate: formData.get('orderDate'),
      expectedDeliveryDate: formData.get('expectedDeliveryDate'),
      notes: formData.get('notes'),
      items,
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const supabase = await getSupabaseClient()
    const session = await requireBusinessSession()
    const salonId = await requireSalonId()

    const totalAmount = result.data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    )

    const orderNumber = `PO-${Date.now()}`

    const { data: order, error: orderError } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .insert({
        salon_id: salonId,
        supplier_id: result.data.supplierId,
        order_number: orderNumber,
        ordered_at: result.data.orderDate,
        expected_delivery_at: result.data.expectedDeliveryDate || null,
        subtotal: totalAmount,
        total_amount: totalAmount,
        status: 'pending',
        notes: result.data.notes || null,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      return { error: orderError?.message || 'Failed to create order' }
    }

    const orderItems = result.data.items.map((item) => ({
      purchase_order_id: order.id,
      product_id: item.productId,
      quantity_ordered: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.quantity * item.unitPrice,
    }))

    const { error: itemsError } = await supabase
      .schema('inventory')
      .from('purchase_order_items')
      .insert(orderItems)

    if (itemsError) {
      await supabase.schema('inventory').from('purchase_orders').delete().eq('id', order.id)
      return { error: itemsError.message }
    }

    revalidatePath('/business/inventory/purchase-orders')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create order' }
  }
}
