'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const orderItemSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
})

const orderSchema = z.object({
  supplierId: z.string().regex(UUID_REGEX),
  orderDate: z.string(),
  expectedDeliveryDate: z.string().optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
})

export async function createPurchaseOrder(formData: FormData) {
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

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // Calculate totals
    const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

    // Generate order number (simple timestamp-based for now)
    const orderNumber = `PO-${Date.now()}`

    // Create purchase order
    const { data: order, error: orderError } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .insert({
        salon_id: staffProfile.salon_id,
        supplier_id: data.supplierId,
        order_number: orderNumber,
        ordered_at: data.orderDate,
        expected_delivery_at: data.expectedDeliveryDate || null,
        subtotal: totalAmount,
        total_amount: totalAmount,
        status: 'pending',
        notes: data.notes || null,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })
      .select()
      .single()

    if (orderError || !order) return { error: orderError?.message || 'Failed to create order' }

    // Create order items
    const orderItems = data.items.map((item) => ({
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
      // Rollback: delete the order
      await supabase
        .schema('inventory')
        .from('purchase_orders')
        .delete()
        .eq('id', order.id)

      return { error: itemsError.message }
    }

    revalidatePath('/business/inventory/purchase-orders')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create order' }
  }
}

export async function updatePurchaseOrderStatus(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    const status = formData.get('status')?.toString()

    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }
    if (!status || !['pending', 'approved', 'ordered', 'received', 'cancelled'].includes(status)) {
      return { error: 'Invalid status' }
    }

    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    const updateData: Record<string, unknown> = {
      status,
      updated_by_id: session.user.id,
    }

    if (status === 'received') {
      updateData.actual_delivery_date = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .update(updateData)
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/inventory/purchase-orders')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update status' }
  }
}

export async function receivePurchaseOrderItems(formData: FormData) {
  try {
    const orderId = formData.get('orderId')?.toString()
    const itemsJson = formData.get('items')?.toString()

    if (!orderId || !UUID_REGEX.test(orderId)) return { error: 'Invalid order ID' }
    if (!itemsJson) return { error: 'No items provided' }

    const items = JSON.parse(itemsJson) as Array<{ id: string; quantityReceived: number }>

    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // Verify order belongs to salon
    const { data: order } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .select('id')
      .eq('id', orderId)
      .eq('salon_id', staffProfile.salon_id)
      .single()

    if (!order) return { error: 'Purchase order not found' }

    // Update each item's received quantity
    for (const item of items) {
      if (!UUID_REGEX.test(item.id)) continue
      if (item.quantityReceived < 0) continue

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

    // Check if all items are received, update order status
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
    }

    revalidatePath('/business/inventory/purchase-orders')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to receive items' }
  }
}

export async function deletePurchaseOrder(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // Can only delete pending orders
    const { data: order } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .select('status')
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)
      .single()

    if (order?.status !== 'pending') {
      return { error: 'Only pending orders can be deleted' }
    }

    const { error: deleteError } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/inventory/purchase-orders')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete order' }
  }
}
