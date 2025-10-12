'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { resolveBusinessContext, UUID_REGEX } from './stock-levels-shared'

const stockCountItemSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  countedQuantity: z.number().int().min(0),
})

const performStockCountSchema = z.object({
  locationId: z.string().regex(UUID_REGEX),
  items: z.array(stockCountItemSchema).min(1),
  notes: z.string().max(500).optional().or(z.literal('')),
})

const STOCK_LEVELS_PATH = '/business/inventory/stock-levels'
const INVENTORY_SCHEMA = 'inventory'

export async function performStockCount(formData: FormData) {
  try {
    const itemsStr = formData.get('items') as string
    const items = itemsStr ? JSON.parse(itemsStr) : []

    const parsed = performStockCountSchema.safeParse({
      locationId: formData.get('locationId'),
      items,
      notes: formData.get('notes'),
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    const { supabase, session } = await resolveBusinessContext()

    const results = []
    const errors = []

    for (const item of data.items) {
      const { data: currentStock } = await supabase
        .schema(INVENTORY_SCHEMA)
        .from('stock_levels')
        .select('quantity')
        .eq('product_id', item.productId)
        .eq('location_id', data.locationId)
        .single()

      if (!currentStock) {
        errors.push(`Stock level not found for product ${item.productId}`)
        continue
      }

      const currentQuantity = currentStock.quantity || 0
      const difference = item.countedQuantity - currentQuantity

      if (difference !== 0) {
        const { error: movementError } = await supabase
          .schema(INVENTORY_SCHEMA)
          .from('stock_movements')
          .insert({
            location_id: data.locationId,
            product_id: item.productId,
            from_location_id: difference < 0 ? data.locationId : null,
            to_location_id: difference > 0 ? data.locationId : null,
            quantity: Math.abs(difference),
            movement_type: 'count_adjustment',
            notes: data.notes || `Stock count adjustment: Expected ${currentQuantity}, Found ${item.countedQuantity}`,
            performed_by_id: session.user.id,
          })

        if (movementError) {
          errors.push(movementError.message)
          continue
        }

        const { error: updateError } = await supabase
          .schema(INVENTORY_SCHEMA)
          .from('stock_levels')
          .update({ quantity: item.countedQuantity })
          .eq('product_id', item.productId)
          .eq('location_id', data.locationId)

        if (updateError) {
          errors.push(updateError.message)
          continue
        }

        results.push({
          productId: item.productId,
          oldQuantity: currentQuantity,
          newQuantity: item.countedQuantity,
          difference,
        })
      }
    }

    revalidatePath(STOCK_LEVELS_PATH)

    if (errors.length > 0) {
      return {
        error: `Stock count completed with errors: ${errors.join(', ')}`,
        results,
      }
    }

    return { success: true, results }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to perform stock count',
    }
  }
}
