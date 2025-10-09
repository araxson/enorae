'use server'

import { revalidatePath } from 'next/cache'
import { adjustStockSchema } from '../utils/schemas'
import { getSupabaseClient, requireBusinessSession } from '../utils/supabase'

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

    const supabase = await getSupabaseClient()
    const session = await requireBusinessSession()

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) {
      return { error: 'Salon not found' }
    }

    const { data: currentStock } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .select('quantity')
      .eq('product_id', result.data.productId)
      .eq('location_id', result.data.locationId)
      .single()

    if (!currentStock) {
      return { error: 'Stock level not found' }
    }

    let newQuantity = currentStock.quantity || 0
    let movementQuantity = 0

    switch (result.data.adjustmentType) {
      case 'add':
        newQuantity += result.data.quantity
        movementQuantity = result.data.quantity
        break
      case 'subtract':
        newQuantity -= result.data.quantity
        movementQuantity = -result.data.quantity
        if (newQuantity < 0) {
          return { error: 'Resulting quantity cannot be negative' }
        }
        break
      case 'set':
        movementQuantity = result.data.quantity - newQuantity
        newQuantity = result.data.quantity
        break
    }

    const { error: movementError } = await supabase
      .schema('inventory')
      .from('stock_movements')
      .insert({
        location_id: result.data.locationId,
        product_id: result.data.productId,
        to_location_id: movementQuantity >= 0 ? result.data.locationId : null,
        from_location_id: movementQuantity < 0 ? result.data.locationId : null,
        quantity: Math.abs(movementQuantity),
        movement_type: 'adjustment',
        notes: result.data.reason,
        performed_by_id: session.user.id,
      })

    if (movementError) return { error: movementError.message }

    const { error: updateError } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .update({ quantity: newQuantity })
      .eq('product_id', result.data.productId)
      .eq('location_id', result.data.locationId)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/inventory/products')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to adjust stock' }
  }
}
