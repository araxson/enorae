'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import { UUID_REGEX, type ActionResult } from './helpers'

export async function updateStockLevel(
  locationId: string,
  productId: string,
  quantity: number,
  reason: string,
): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(locationId) || !UUID_REGEX.test(productId)) {
      return { error: 'Invalid ID format' }
    }

    const supabase = await createClient()
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    if (!session.user) return { error: 'Unauthorized' }

    const { data: product } = await supabase
      .schema('inventory')
      .from('products')
      .select('salon_id')
      .eq('id', productId)
      .single<{ salon_id: string | null }>()

    if (!product?.salon_id || !(await canAccessSalon(product.salon_id))) {
      return { error: 'Unauthorized: Not your product' }
    }

    const { data: location } = await supabase
      .schema('inventory')
      .from('stock_locations')
      .select('salon_id')
      .eq('id', locationId)
      .single<{ salon_id: string | null }>()

    if (!location?.salon_id || location.salon_id !== product.salon_id) {
      return { error: 'Location and product must belong to same salon' }
    }

    const { data: currentStock } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .select('quantity')
      .eq('location_id', locationId)
      .eq('product_id', productId)
      .single()

    const currentQuantity = currentStock?.quantity || 0
    const newQuantity = currentQuantity + quantity

    const { error: stockError } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .upsert({
        location_id: locationId,
        product_id: productId,
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })

    if (stockError) throw stockError

    const { error: movementError } = await supabase
      .schema('inventory')
      .from('stock_movements')
      .insert({
        location_id: locationId,
        product_id: productId,
        quantity,
        movement_type: quantity > 0 ? 'adjustment_in' : 'adjustment_out',
        reason,
        performed_by_id: session.user.id,
      })

    if (movementError) throw movementError

    revalidatePath('/business/inventory')
    return { success: true }
  } catch (error) {
    console.error('Error updating stock level:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update stock level',
    }
  }
}

export async function resolveStockAlert(alertId: string): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(alertId)) {
      return { error: 'Invalid alert ID format' }
    }

    const supabase = await createClient()
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    if (!session.user) return { error: 'Unauthorized' }

    const { data: alert } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .select('product_id')
      .eq('id', alertId)
      .single<{ product_id: string | null }>()

    if (!alert?.product_id) return { error: 'Alert not found' }

    const { data: product } = await supabase
      .schema('inventory')
      .from('products')
      .select('salon_id')
      .eq('id', alert.product_id)
      .single<{ salon_id: string | null }>()

    if (!product?.salon_id || !(await canAccessSalon(product.salon_id))) {
      return { error: 'Unauthorized: Not your alert' }
    }

    const { error } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by_id: session.user.id,
      })
      .eq('id', alertId)

    if (error) throw error

    revalidatePath('/business/inventory')
    return { success: true }
  } catch (error) {
    console.error('Error resolving stock alert:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to resolve alert',
    }
  }
}
