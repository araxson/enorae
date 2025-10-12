'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { resolveBusinessContext, UUID_REGEX } from './stock-levels-shared'

const adjustStockSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  locationId: z.string().regex(UUID_REGEX),
  quantity: z.number().int(),
  adjustmentType: z.enum(['add', 'subtract', 'set']),
  reason: z.string().min(1).max(500),
})

const STOCK_LEVELS_PATH = '/business/inventory/stock-levels'
const INVENTORY_SCHEMA = 'inventory'

type AdjustmentResult = {
  newQuantity: number
  movementQuantity: number
}

function calculateAdjustment(currentQuantity: number, type: 'add' | 'subtract' | 'set', amount: number): AdjustmentResult | { error: string } {
  let newQuantity = currentQuantity
  let movementQuantity = 0

  switch (type) {
    case 'add':
      newQuantity += amount
      movementQuantity = amount
      break
    case 'subtract':
      newQuantity -= amount
      movementQuantity = -amount
      if (newQuantity < 0) {
        return { error: 'Resulting quantity cannot be negative' }
      }
      break
    case 'set':
      movementQuantity = amount - newQuantity
      newQuantity = amount
      break
  }

  return { newQuantity, movementQuantity }
}

export async function adjustStock(formData: FormData) {
  try {
    const parsed = adjustStockSchema.safeParse({
      productId: formData.get('productId'),
      locationId: formData.get('locationId'),
      quantity: formData.get('quantity') ? parseFloat(formData.get('quantity') as string) : undefined,
      adjustmentType: formData.get('adjustmentType'),
      reason: formData.get('reason'),
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    const { supabase, session } = await resolveBusinessContext()

    const { data: currentStock } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('stock_levels')
      .select('quantity')
      .eq('product_id', data.productId)
      .eq('location_id', data.locationId)
      .single()

    if (!currentStock) {
      return { error: 'Stock level not found' }
    }

    const result = calculateAdjustment(currentStock.quantity || 0, data.adjustmentType, data.quantity)
    if ('error' in result) {
      return { error: result.error }
    }

    const { newQuantity, movementQuantity } = result

    const { error: movementError } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('stock_movements')
      .insert({
        location_id: data.locationId,
        product_id: data.productId,
        to_location_id: movementQuantity >= 0 ? data.locationId : null,
        from_location_id: movementQuantity < 0 ? data.locationId : null,
        quantity: Math.abs(movementQuantity),
        movement_type: 'adjustment',
        notes: data.reason,
        performed_by_id: session.user.id,
      })

    if (movementError) {
      return { error: movementError.message }
    }

    const { error: updateError } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('stock_levels')
      .update({ quantity: newQuantity })
      .eq('product_id', data.productId)
      .eq('location_id', data.locationId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath(STOCK_LEVELS_PATH)
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to adjust stock',
    }
  }
}
