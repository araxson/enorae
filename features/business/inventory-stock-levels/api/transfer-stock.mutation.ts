'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { resolveBusinessContext, UUID_REGEX } from './stock-levels-shared'

const transferStockSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  fromLocationId: z.string().regex(UUID_REGEX),
  toLocationId: z.string().regex(UUID_REGEX),
  quantity: z.number().positive(),
  notes: z.string().max(500).optional().or(z.literal('')),
})

const STOCK_LEVELS_PATH = '/business/inventory/stock-levels'
const INVENTORY_SCHEMA = 'inventory'

export async function transferStock(formData: FormData) {
  try {
    const result = transferStockSchema.safeParse({
      productId: formData.get('productId'),
      fromLocationId: formData.get('fromLocationId'),
      toLocationId: formData.get('toLocationId'),
      quantity: formData.get('quantity') ? parseFloat(formData.get('quantity') as string) : undefined,
      notes: formData.get('notes'),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    const data = result.data
    if (data.fromLocationId === data.toLocationId) {
      return { error: 'Cannot transfer stock within the same location' }
    }

    const { supabase, session } = await resolveBusinessContext()

    const { data: fromStock } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('stock_levels')
      .select('quantity')
      .eq('product_id', data.productId)
      .eq('location_id', data.fromLocationId)
      .single()

    if (!fromStock) {
      return { error: 'Stock level not found at source location' }
    }

    if ((fromStock.quantity || 0) < data.quantity) {
      return { error: `Insufficient stock. Available: ${fromStock.quantity || 0}` }
    }

    const { error: movementError } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('stock_movements')
      .insert({
        location_id: data.fromLocationId,
        product_id: data.productId,
        from_location_id: data.fromLocationId,
        to_location_id: data.toLocationId,
        quantity: data.quantity,
        movement_type: 'transfer',
        notes: data.notes || null,
        performed_by_id: session.user.id,
      })

    if (movementError) {
      return { error: movementError.message }
    }

    const { error: fromUpdateError } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('stock_levels')
      .update({ quantity: (fromStock.quantity || 0) - data.quantity })
      .eq('product_id', data.productId)
      .eq('location_id', data.fromLocationId)

    if (fromUpdateError) {
      return { error: fromUpdateError.message }
    }

    const { data: toStock } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('stock_levels')
      .select('quantity')
      .eq('product_id', data.productId)
      .eq('location_id', data.toLocationId)
      .single()

    if (toStock) {
      const { error: toUpdateError } = await supabase
        .schema(INVENTORY_SCHEMA)
        .from('stock_levels')
        .update({ quantity: (toStock.quantity || 0) + data.quantity })
        .eq('product_id', data.productId)
        .eq('location_id', data.toLocationId)

      if (toUpdateError) {
        return { error: toUpdateError.message }
      }
    } else {
      const { error: toInsertError } = await supabase
        .schema(INVENTORY_SCHEMA)
        .from('stock_levels')
        .insert({
          product_id: data.productId,
          location_id: data.toLocationId,
          quantity: data.quantity,
        })

      if (toInsertError) {
        return { error: toInsertError.message }
      }
    }

    revalidatePath(STOCK_LEVELS_PATH)
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to transfer stock',
    }
  }
}
