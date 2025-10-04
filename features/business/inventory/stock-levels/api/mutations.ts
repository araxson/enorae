'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const transferStockSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  fromLocationId: z.string().regex(UUID_REGEX),
  toLocationId: z.string().regex(UUID_REGEX),
  quantity: z.number().positive(),
  notes: z.string().max(500).optional().or(z.literal('')),
})

/**
 * Transfer stock between locations
 * SECURITY: Business users only
 */
export async function transferStock(formData: FormData) {
  try {
    const result = transferStockSchema.safeParse({
      productId: formData.get('productId'),
      fromLocationId: formData.get('fromLocationId'),
      toLocationId: formData.get('toLocationId'),
      quantity: formData.get('quantity') ? parseFloat(formData.get('quantity') as string) : undefined,
      notes: formData.get('notes'),
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    if (data.fromLocationId === data.toLocationId) {
      return { error: 'Cannot transfer to the same location' }
    }

    // Get user's salon
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) {
      return { error: 'Salon not found' }
    }

    // Verify from location has enough stock
    const { data: fromStock } = await supabase
      .schema('inventory')
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

    // Create stock movement record
    const { error: movementError } = await supabase
      .schema('inventory')
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

    if (movementError) return { error: movementError.message }

    // Update stock levels
    const { error: fromUpdateError } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .update({
        quantity: (fromStock.quantity || 0) - data.quantity,
      })
      .eq('product_id', data.productId)
      .eq('location_id', data.fromLocationId)

    if (fromUpdateError) return { error: fromUpdateError.message }

    // Check if to location already has stock
    const { data: toStock } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .select('quantity')
      .eq('product_id', data.productId)
      .eq('location_id', data.toLocationId)
      .single()

    if (toStock) {
      const { error: toUpdateError } = await supabase
        .schema('inventory')
        .from('stock_levels')
        .update({
          quantity: (toStock.quantity || 0) + data.quantity,
        })
        .eq('product_id', data.productId)
        .eq('location_id', data.toLocationId)

      if (toUpdateError) return { error: toUpdateError.message }
    } else {
      const { error: toInsertError } = await supabase
        .schema('inventory')
        .from('stock_levels')
        .insert({
          product_id: data.productId,
          location_id: data.toLocationId,
          quantity: data.quantity,
        })

      if (toInsertError) return { error: toInsertError.message }
    }

    revalidatePath('/business/inventory/stock-levels')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to transfer stock' }
  }
}

const adjustStockSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  locationId: z.string().regex(UUID_REGEX),
  quantity: z.number().int(),
  adjustmentType: z.enum(['add', 'subtract', 'set']),
  reason: z.string().min(1).max(500),
})

/**
 * Adjust stock quantity (add, subtract, or set)
 * SECURITY: Business users only
 */
export async function adjustStock(formData: FormData) {
  try {
    const result = adjustStockSchema.safeParse({
      productId: formData.get('productId'),
      locationId: formData.get('locationId'),
      quantity: formData.get('quantity') ? parseFloat(formData.get('quantity') as string) : undefined,
      adjustmentType: formData.get('adjustmentType'),
      reason: formData.get('reason'),
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Get user's salon
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) {
      return { error: 'Salon not found' }
    }

    // Get current stock level
    const { data: currentStock } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .select('quantity')
      .eq('product_id', data.productId)
      .eq('location_id', data.locationId)
      .single()

    if (!currentStock) {
      return { error: 'Stock level not found' }
    }

    // Calculate new quantity
    let newQuantity = currentStock.quantity || 0
    let movementQuantity = 0

    switch (data.adjustmentType) {
      case 'add':
        newQuantity += data.quantity
        movementQuantity = data.quantity
        break
      case 'subtract':
        newQuantity -= data.quantity
        movementQuantity = -data.quantity
        if (newQuantity < 0) {
          return { error: 'Resulting quantity cannot be negative' }
        }
        break
      case 'set':
        movementQuantity = data.quantity - newQuantity
        newQuantity = data.quantity
        break
    }

    // Create stock movement record
    const { error: movementError } = await supabase
      .schema('inventory')
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

    if (movementError) return { error: movementError.message }

    // Update stock level
    const { error: updateError } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .update({
        quantity: newQuantity,
      })
      .eq('product_id', data.productId)
      .eq('location_id', data.locationId)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/inventory/stock-levels')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to adjust stock' }
  }
}
