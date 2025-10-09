'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type ProductUpdate = Database['inventory']['Tables']['products']['Update']
type StockMovementInsert = Database['inventory']['Tables']['stock_movements']['Insert']
type StockLevelUpdate = Database['inventory']['Tables']['stock_levels']['Update']

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Batch update product prices
 */
const batchUpdatePricesSchema = z.object({
  productIds: z.array(z.string().regex(UUID_REGEX)),
  priceChange: z.number(),
  changeType: z.enum(['fixed', 'percentage']),
  applyTo: z.enum(['cost', 'retail', 'both']),
})

export async function batchUpdatePrices(
  productIds: string[],
  priceChange: number,
  changeType: 'fixed' | 'percentage',
  applyTo: 'cost' | 'retail' | 'both'
) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = batchUpdatePricesSchema.safeParse({
    productIds,
    priceChange,
    changeType,
    applyTo,
  })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  if (productIds.length === 0) {
    throw new Error('No products selected')
  }

  const supabase = await createClient()

  // Verify products belong to user's salon
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, salon_id, cost_price, retail_price')
    .in('id', productIds)
    .eq('salon_id', salonId)

  if (fetchError) throw fetchError
  if (!products || products.length === 0) {
    throw new Error('No products found')
  }

  if (products.length !== productIds.length) {
    throw new Error('Some products do not belong to your salon')
  }

  // Calculate new prices for each product
  for (const product of products) {
    const updateData: ProductUpdate = {}

    if (applyTo === 'cost' || applyTo === 'both') {
      const currentCost = product.cost_price || 0
      const newCost =
        changeType === 'fixed'
          ? currentCost + priceChange
          : currentCost * (1 + priceChange / 100)
      updateData.cost_price = Math.max(0, newCost)
    }

    if (applyTo === 'retail' || applyTo === 'both') {
      const currentRetail = product.retail_price || 0
      const newRetail =
        changeType === 'fixed'
          ? currentRetail + priceChange
          : currentRetail * (1 + priceChange / 100)
      updateData.retail_price = Math.max(0, newRetail)
    }

    // Update individual product
    const { error: updateError } = await supabase
      .schema('inventory')
      .from('products')
      .update(updateData)
      .eq('id', product.id)
      .eq('salon_id', salonId)

    if (updateError) throw updateError
  }

  revalidatePath('/business/inventory')
  return {
    success: true,
    updated: products.length,
    changeType,
    priceChange,
    applyTo,
  }
}

/**
 * Batch activate products
 */
const batchActivateSchema = z.object({
  productIds: z.array(z.string().regex(UUID_REGEX)),
})

export async function batchActivateProducts(productIds: string[]) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = batchActivateSchema.safeParse({ productIds })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  if (productIds.length === 0) {
    throw new Error('No products selected')
  }

  const supabase = await createClient()

  // Verify products belong to user's salon
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, salon_id')
    .in('id', productIds)
    .eq('salon_id', salonId)

  if (fetchError) throw fetchError
  if (!products || products.length === 0) {
    throw new Error('No products found')
  }

  if (products.length !== productIds.length) {
    throw new Error('Some products do not belong to your salon')
  }

  // Activate all products
  const updateData: ProductUpdate = { is_active: true }

  const { error } = await supabase
    .schema('inventory')
    .from('products')
    .update(updateData)
    .in('id', productIds)
    .eq('salon_id', salonId)

  if (error) throw error

  revalidatePath('/business/inventory')
  return {
    success: true,
    activated: products.length,
  }
}

/**
 * Batch deactivate products
 */
const batchDeactivateSchema = z.object({
  productIds: z.array(z.string().regex(UUID_REGEX)),
})

export async function batchDeactivateProducts(productIds: string[]) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = batchDeactivateSchema.safeParse({ productIds })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  if (productIds.length === 0) {
    throw new Error('No products selected')
  }

  const supabase = await createClient()

  // Verify products belong to user's salon
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, salon_id')
    .in('id', productIds)
    .eq('salon_id', salonId)

  if (fetchError) throw fetchError
  if (!products || products.length === 0) {
    throw new Error('No products found')
  }

  if (products.length !== productIds.length) {
    throw new Error('Some products do not belong to your salon')
  }

  // Deactivate all products
  const updateData: ProductUpdate = { is_active: false }

  const { error } = await supabase
    .schema('inventory')
    .from('products')
    .update(updateData)
    .in('id', productIds)
    .eq('salon_id', salonId)

  if (error) throw error

  revalidatePath('/business/inventory')
  return {
    success: true,
    deactivated: products.length,
  }
}

/**
 * Batch transfer stock between locations
 */
const batchTransferStockSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().regex(UUID_REGEX),
      quantity: z.number().positive(),
    })
  ),
  fromLocationId: z.string().regex(UUID_REGEX),
  toLocationId: z.string().regex(UUID_REGEX),
  notes: z.string().optional(),
})

export async function batchTransferStock(
  items: Array<{ productId: string; quantity: number }>,
  fromLocationId: string,
  toLocationId: string,
  notes?: string
) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = batchTransferStockSchema.safeParse({
    items,
    fromLocationId,
    toLocationId,
    notes,
  })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  if (items.length === 0) {
    throw new Error('No items to transfer')
  }

  if (fromLocationId === toLocationId) {
    throw new Error('Cannot transfer to the same location')
  }

  const supabase = await createClient()

  // Get user ID for audit trail
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify locations belong to salon
  const { data: locations, error: locError } = await supabase
    .from('stock_locations')
    .select('id, salon_id')
    .in('id', [fromLocationId, toLocationId])

  if (locError) throw locError
  if (!locations || locations.length !== 2) {
    throw new Error('Invalid locations')
  }

  for (const location of locations) {
    const locationSalonId = (location as { salon_id: string | null }).salon_id
    if (locationSalonId !== salonId) {
      throw new Error('Locations must belong to your salon')
    }
  }

  // Process each item transfer
  const productIds = items.map((i) => i.productId)

  // Verify products and stock levels
  const { data: stockLevels, error: stockError } = await supabase
    .from('stock_levels')
    .select('product_id, location_id, quantity')
    .in('product_id', productIds)
    .eq('location_id', fromLocationId)

  if (stockError) throw stockError

  const stockMap = new Map(stockLevels?.map((s) => [s.product_id, s.quantity]) || [])

  // Validate sufficient stock
  for (const item of items) {
    const available = stockMap.get(item.productId) || 0
    if (available < item.quantity) {
      throw new Error(
        `Insufficient stock for product ${item.productId}. Available: ${available}, Requested: ${item.quantity}`
      )
    }
  }

  // Perform transfers for each item
  for (const item of items) {
    // Reduce stock at source location
    const { error: reduceError } = await supabase.rpc('adjust_stock', {
      p_product_id: item.productId,
      p_location_id: fromLocationId,
      p_quantity: -item.quantity,
      p_movement_type: 'transfer_out',
      p_notes: notes || 'Batch transfer',
      p_performed_by_id: user.id,
    })

    if (reduceError) throw reduceError

    // Increase stock at destination location
    const { error: increaseError } = await supabase.rpc('adjust_stock', {
      p_product_id: item.productId,
      p_location_id: toLocationId,
      p_quantity: item.quantity,
      p_movement_type: 'transfer_in',
      p_notes: notes || 'Batch transfer',
      p_performed_by_id: user.id,
    })

    if (increaseError) throw increaseError

    // Create stock movement record for transfer
    const movementData: StockMovementInsert = {
      product_id: item.productId,
      location_id: toLocationId,
      from_location_id: fromLocationId,
      to_location_id: toLocationId,
      quantity: item.quantity,
      movement_type: 'transfer',
      notes: notes || 'Batch transfer',
      performed_by_id: user.id,
    }

    const { error: movementError } = await supabase
      .schema('inventory')
      .from('stock_movements')
      .insert(movementData)

    if (movementError) throw movementError
  }

  revalidatePath('/business/inventory')
  return {
    success: true,
    transferred: items.length,
    fromLocationId,
    toLocationId,
  }
}
