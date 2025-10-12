import 'server-only'

import { z } from 'zod'
import {
  UUID_REGEX,
  assertNonEmpty,
  ensureSalonOwnership,
  getInventoryContext,
  revalidateInventory,
} from './helpers'
import type {
  StockLevelRow,
  StockMovementInsert,
} from './types'

const transferItemSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  quantity: z.number().positive(),
})

const batchTransferStockSchema = z.object({
  items: z.array(transferItemSchema),
  fromLocationId: z.string().regex(UUID_REGEX),
  toLocationId: z.string().regex(UUID_REGEX),
  notes: z.string().optional(),
})

export async function batchTransferStock(
  items: Array<{ productId: string; quantity: number }>,
  fromLocationId: string,
  toLocationId: string,
  notes?: string,
) {
  const { supabase, salonId } = await getInventoryContext()

  const validation = batchTransferStockSchema.safeParse({
    items,
    fromLocationId,
    toLocationId,
    notes,
  })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  assertNonEmpty(items, 'No items to transfer')

  if (fromLocationId === toLocationId) {
    throw new Error('Cannot transfer to the same location')
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  const { data: locations, error: locError } = await supabase
    .from('stock_locations')
    .select('id, salon_id')
    .in('id', [fromLocationId, toLocationId])

  if (locError) throw locError

  const locationRows =
    (locations ?? []) as Array<{ id: string | null; salon_id: string | null }>

  ensureSalonOwnership(locationRows, salonId)

  const productIds = items.map((item) => item.productId)

  const { data: stockLevels, error: stockError } = await supabase
    .from('stock_levels')
    .select('product_id, location_id, quantity')
    .in('product_id', productIds)
    .eq('location_id', fromLocationId)

  if (stockError) throw stockError

  const stockMap = new Map(
    (stockLevels ?? [])
      .filter(
        (row): row is Pick<StockLevelRow, 'product_id' | 'quantity'> =>
          Boolean(row.product_id),
      )
      .map((row) => [row.product_id as string, row.quantity ?? 0]),
  )

  for (const item of items) {
    const available = stockMap.get(item.productId) ?? 0
    if (available < item.quantity) {
      throw new Error(
        `Insufficient stock for product ${item.productId}. Available: ${available}, Requested: ${item.quantity}`,
      )
    }
  }

  for (const item of items) {
    const baseParams = {
      p_product_id: item.productId,
      p_notes: notes || 'Batch transfer',
      p_performed_by_id: user.id,
    }

    const { error: reduceError } = await supabase.rpc('adjust_stock', {
      ...baseParams,
      p_location_id: fromLocationId,
      p_quantity: -item.quantity,
      p_movement_type: 'transfer_out',
    })

    if (reduceError) throw reduceError

    const { error: increaseError } = await supabase.rpc('adjust_stock', {
      ...baseParams,
      p_location_id: toLocationId,
      p_quantity: item.quantity,
      p_movement_type: 'transfer_in',
    })

    if (increaseError) throw increaseError

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

  revalidateInventory()

  return {
    success: true,
    transferred: items.length,
    fromLocationId,
    toLocationId,
  }
}
