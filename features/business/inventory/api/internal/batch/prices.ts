import 'server-only'

import { z } from 'zod'
import type { ProductRow, ProductUpdate } from './types'
import {
  UUID_REGEX,
  assertNonEmpty,
  ensureSalonOwnership,
  getInventoryContext,
  revalidateInventory,
  productIdArraySchema,
} from './helpers'

const batchUpdatePricesSchema = z.object({
  productIds: productIdArraySchema,
  priceChange: z.number(),
  changeType: z.enum(['fixed', 'percentage']),
  applyTo: z.enum(['cost', 'retail', 'both']),
})

function calculatePrice(
  currentValue: number,
  change: number,
  changeType: 'fixed' | 'percentage',
) {
  const result =
    changeType === 'fixed'
      ? currentValue + change
      : currentValue * (1 + change / 100)

  return Math.max(0, result)
}

function buildUpdate(
  product: Pick<ProductRow, 'cost_price' | 'retail_price'>,
  priceChange: number,
  changeType: 'fixed' | 'percentage',
  applyTo: 'cost' | 'retail' | 'both',
): ProductUpdate {
  const updateData: ProductUpdate = {}

  if (applyTo === 'cost' || applyTo === 'both') {
    const currentCost = product.cost_price ?? 0
    updateData.cost_price = calculatePrice(currentCost, priceChange, changeType)
  }

  if (applyTo === 'retail' || applyTo === 'both') {
    const currentRetail = product.retail_price ?? 0
    updateData.retail_price = calculatePrice(
      currentRetail,
      priceChange,
      changeType,
    )
  }

  return updateData
}

export async function batchUpdatePrices(
  productIds: string[],
  priceChange: number,
  changeType: 'fixed' | 'percentage',
  applyTo: 'cost' | 'retail' | 'both',
) {
  const { supabase, salonId } = await getInventoryContext()

  const validation = batchUpdatePricesSchema.safeParse({
    productIds,
    priceChange,
    changeType,
    applyTo,
  })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  assertNonEmpty(productIds, 'No products selected')

  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, salon_id, cost_price, retail_price')
    .in('id', productIds)
    .eq('salon_id', salonId)

  if (fetchError) throw fetchError

  const productRows =
    (products ?? []) as Array<
      Pick<ProductRow, 'id' | 'salon_id' | 'cost_price' | 'retail_price'>
    >

  ensureSalonOwnership(productRows, salonId)

  await Promise.all(
    productRows.map(async (product) => {
      if (!product.id) return

      const updateData = buildUpdate(
        product,
        priceChange,
        changeType,
        applyTo,
      )

      const { error: updateError } = await supabase
        .schema('inventory')
        .from('products')
        .update(updateData)
        .eq('id', product.id)
        .eq('salon_id', salonId)

      if (updateError) throw updateError
    }),
  )

  revalidateInventory()

  return {
    success: true,
    updated: productRows.length,
    changeType,
    priceChange,
    applyTo,
  }
}

const batchActivateSchema = z.object({
  productIds: productIdArraySchema,
})

async function updateProductStatus(
  productIds: string[],
  isActive: boolean,
) {
  const { supabase, salonId } = await getInventoryContext()

  const validation = batchActivateSchema.safeParse({ productIds })
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  assertNonEmpty(productIds, 'No products selected')

  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, salon_id')
    .in('id', productIds)
    .eq('salon_id', salonId)

  if (fetchError) throw fetchError

  const productRows = (products ?? []) as Array<
    Pick<ProductRow, 'id' | 'salon_id'>
  >

  ensureSalonOwnership(productRows, salonId)

  const { error } = await supabase
    .schema('inventory')
    .from('products')
    .update({ is_active: isActive } satisfies ProductUpdate)
    .in('id', productIds)
    .eq('salon_id', salonId)

  if (error) throw error

  revalidateInventory()

  return {
    success: true,
    count: productRows.length,
    isActive,
  }
}

export async function batchActivateProducts(productIds: string[]) {
  const result = await updateProductStatus(productIds, true)
  return {
    success: result.success,
    activated: result.count,
  }
}

export async function batchDeactivateProducts(productIds: string[]) {
  const result = await updateProductStatus(productIds, false)
  return {
    success: result.success,
    deactivated: result.count,
  }
}
