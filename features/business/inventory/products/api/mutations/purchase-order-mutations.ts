'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import { UUID_REGEX, type ActionResult } from './helpers'

const purchaseOrderSchema = z.object({
  supplier_id: z.string().regex(UUID_REGEX),
  expected_delivery_at: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().regex(UUID_REGEX),
        quantity_ordered: z.number().int().min(1),
        unit_price: z.number().min(0),
      }),
    )
    .min(1, 'At least one item is required'),
})

export async function createPurchaseOrder(
  salonId: string,
  data: z.infer<typeof purchaseOrderSchema>,
): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const validated = purchaseOrderSchema.parse(data)
    const supabase = await createClient()
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    if (!session.user) return { error: 'Unauthorized' }
    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized: Not your salon' }
    }

    const totalAmount = validated.items.reduce(
      (sum, item) => sum + item.quantity_ordered * item.unit_price,
      0,
    )

    const orderNumber = `PO-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')}-${randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`

    const { data: order, error: orderError } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .insert({
        salon_id: salonId,
        supplier_id: validated.supplier_id,
        order_number: orderNumber,
        expected_delivery_at: validated.expected_delivery_at || null,
        notes: validated.notes || null,
        total_amount: totalAmount,
        status: 'pending',
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = validated.items.map((item) => ({
      purchase_order_id: order.id,
      product_id: item.product_id,
      quantity_ordered: item.quantity_ordered,
      unit_price: item.unit_price,
      total_price: item.quantity_ordered * item.unit_price,
    }))

    const { error: itemsError } = await supabase
      .schema('inventory')
      .from('purchase_order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    revalidatePath('/business/inventory')
    return { success: true, data: order }
  } catch (error) {
    console.error('Error creating purchase order:', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create purchase order',
    }
  }
}
