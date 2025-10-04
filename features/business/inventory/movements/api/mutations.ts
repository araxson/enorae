'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const stockMovementSchema = z.object({
  product_id: z.string().regex(UUID_REGEX, 'Invalid product ID'),
  location_id: z.string().regex(UUID_REGEX, 'Invalid location ID'),
  movement_type: z.enum(['in', 'out', 'adjustment', 'transfer', 'return', 'damage', 'theft', 'other'], {
    errorMap: () => ({ message: 'Invalid movement type' }),
  }),
  quantity: z.number().int('Quantity must be a whole number'),
  from_location_id: z.string().regex(UUID_REGEX).optional(),
  to_location_id: z.string().regex(UUID_REGEX).optional(),
  cost_price: z.number().min(0, 'Cost must be non-negative').optional(),
  notes: z.string().optional(),
})

export type ActionResult = {
  success?: boolean
  error?: string
  data?: unknown
}

/**
 * Create a manual stock movement
 */
export async function createStockMovement(formData: FormData): Promise<ActionResult> {
  try {
    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const supabase = await createClient()

    // Get user's salon
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Parse input
    const input = {
      product_id: formData.get('productId') as string,
      location_id: formData.get('locationId') as string,
      movement_type: formData.get('movementType') as string,
      quantity: parseInt(formData.get('quantity') as string, 10),
      from_location_id: formData.get('fromLocationId') as string || undefined,
      to_location_id: formData.get('toLocationId') as string || undefined,
      cost_price: formData.get('costPrice') ? parseFloat(formData.get('costPrice') as string) : undefined,
      notes: formData.get('notes') as string || undefined,
    }

    // Validate
    const validated = stockMovementSchema.parse(input)

    // Additional validation for transfer type
    if (validated.movement_type === 'transfer') {
      if (!validated.from_location_id || !validated.to_location_id) {
        return { error: 'Transfer requires both from and to locations' }
      }
    }

    // Verify product belongs to salon
    const { data: product } = await supabase
      .from('products')
      .select('salon_id')
      .eq('id', validated.product_id)
      .single<{ salon_id: string | null }>()

    if (!product || product.salon_id !== staffProfile.salon_id) {
      return { error: 'Product not found or access denied' }
    }

    // Create stock movement
    const { data, error } = await supabase
      .schema('inventory')
      .from('stock_movements')
      .insert({
        product_id: validated.product_id,
        location_id: validated.location_id,
        movement_type: validated.movement_type,
        quantity: validated.quantity,
        from_location_id: validated.from_location_id || null,
        to_location_id: validated.to_location_id || null,
        cost_price: validated.cost_price || null,
        notes: validated.notes || null,
        performed_by_id: session.user.id,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    // Update stock levels based on movement type
    if (validated.movement_type === 'in' || validated.movement_type === 'return') {
      // Increase stock
      await updateStockLevel(
        supabase,
        validated.product_id,
        validated.location_id,
        validated.quantity
      )
    } else if (validated.movement_type === 'out' || validated.movement_type === 'damage' || validated.movement_type === 'theft') {
      // Decrease stock
      await updateStockLevel(
        supabase,
        validated.product_id,
        validated.location_id,
        -validated.quantity
      )
    } else if (validated.movement_type === 'transfer' && validated.from_location_id && validated.to_location_id) {
      // Transfer: decrease from source, increase at destination
      await Promise.all([
        updateStockLevel(supabase, validated.product_id, validated.from_location_id, -validated.quantity),
        updateStockLevel(supabase, validated.product_id, validated.to_location_id, validated.quantity),
      ])
    }

    revalidatePath('/business/inventory/movements')
    revalidatePath('/business/inventory/stock-levels')

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Failed to create stock movement' }
  }
}

/**
 * Helper function to update stock levels
 */
async function updateStockLevel(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string,
  locationId: string,
  quantityChange: number
) {
  // Get current stock level
  const { data: existing } = await supabase
    .from('stock_levels')
    .select('quantity')
    .eq('product_id', productId)
    .eq('location_id', locationId)
    .single<{ quantity: number | null }>()

  if (existing) {
    // Update existing
    const newQuantity = (existing.quantity || 0) + quantityChange
    await supabase
      .schema('inventory')
      .from('stock_levels')
      .update({ quantity: newQuantity })
      .eq('product_id', productId)
      .eq('location_id', locationId)
  } else {
    // Create new
    await supabase
      .schema('inventory')
      .from('stock_levels')
      .insert({
        product_id: productId,
        location_id: locationId,
        quantity: quantityChange,
      })
  }
}
