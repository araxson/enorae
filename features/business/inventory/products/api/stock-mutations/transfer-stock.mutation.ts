'use server'

import { revalidatePath } from 'next/cache'
import { transferStockSchema } from '../utils/schemas'
import { getSupabaseClient, requireBusinessSession } from '../utils/supabase'

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

    const supabase = await getSupabaseClient()
    const session = await requireBusinessSession()

    if (result.data.fromLocationId === result.data.toLocationId) {
      return { error: 'Cannot transfer to the same location' }
    }

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) {
      return { error: 'Salon not found' }
    }

    const { data: fromStock } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .select('quantity')
      .eq('product_id', result.data.productId)
      .eq('location_id', result.data.fromLocationId)
      .single()

    if (!fromStock) {
      return { error: 'Stock level not found at source location' }
    }

    if ((fromStock.quantity || 0) < result.data.quantity) {
      return { error: `Insufficient stock. Available: ${fromStock.quantity || 0}` }
    }

    const { error: movementError } = await supabase
      .schema('inventory')
      .from('stock_movements')
      .insert({
        location_id: result.data.fromLocationId,
        product_id: result.data.productId,
        from_location_id: result.data.fromLocationId,
        to_location_id: result.data.toLocationId,
        quantity: result.data.quantity,
        movement_type: 'transfer',
        notes: result.data.notes || null,
        performed_by_id: session.user.id,
      })

    if (movementError) return { error: movementError.message }

    const { error: fromUpdateError } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .update({ quantity: (fromStock.quantity || 0) - result.data.quantity })
      .eq('product_id', result.data.productId)
      .eq('location_id', result.data.fromLocationId)

    if (fromUpdateError) return { error: fromUpdateError.message }

    const { data: toStock } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .select('quantity')
      .eq('product_id', result.data.productId)
      .eq('location_id', result.data.toLocationId)
      .single()

    if (toStock) {
      const { error: toUpdateError } = await supabase
        .schema('inventory')
        .from('stock_levels')
        .update({ quantity: (toStock.quantity || 0) + result.data.quantity })
        .eq('product_id', result.data.productId)
        .eq('location_id', result.data.toLocationId)

      if (toUpdateError) return { error: toUpdateError.message }
    } else {
      const { error: toInsertError } = await supabase
        .schema('inventory')
        .from('stock_levels')
        .insert({
          product_id: result.data.productId,
          location_id: result.data.toLocationId,
          quantity: result.data.quantity,
        })

      if (toInsertError) return { error: toInsertError.message }
    }

    revalidatePath('/business/inventory/products')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to transfer stock' }
  }
}
