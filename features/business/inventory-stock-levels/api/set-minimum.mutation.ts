'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { resolveBusinessContext, UUID_REGEX } from './stock-levels-shared'

const setMinimumSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  locationId: z.string().regex(UUID_REGEX),
  minimumLevel: z.number().int().min(0),
})

const STOCK_LEVELS_PATH = '/business/inventory/stock-levels'
const INVENTORY_SCHEMA = 'inventory'

export async function setMinimumLevel(formData: FormData) {
  try {
    const parsed = setMinimumSchema.safeParse({
      productId: formData.get('productId'),
      locationId: formData.get('locationId'),
      minimumLevel: formData.get('minimumLevel') ? parseInt(formData.get('minimumLevel') as string) : undefined,
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    const { supabase } = await resolveBusinessContext()

    const { data: stockLevel } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('stock_levels')
      .select('id')
      .eq('product_id', data.productId)
      .eq('location_id', data.locationId)
      .single()

    if (!stockLevel) {
      return { error: 'Stock level not found' }
    }

    const { error: updateError } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('stock_levels')
      .update({ minimum_quantity: data.minimumLevel })
      .eq('product_id', data.productId)
      .eq('location_id', data.locationId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath(STOCK_LEVELS_PATH)
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to set minimum level',
    }
  }
}
