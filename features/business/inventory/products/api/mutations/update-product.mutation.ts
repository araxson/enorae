'use server'

import { z } from 'zod'
import { resolveSupabase, resolveSession, ensureSalonAccess, sanitizePayload, revalidateInventory } from './product-mutation-shared'
import type { Database } from '@/lib/types/database.types'
import type { ActionResult } from './helpers'

const INVENTORY_SCHEMA = 'inventory'
const PRODUCTS_TABLE = 'products'

type ProductUpdate = Database['inventory']['Tables']['products']['Update']

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  category_id: z.string().uuid().optional(),
  supplier_id: z.string().uuid().optional(),
  cost_price: z.number().min(0).optional(),
  retail_price: z.number().min(0).optional(),
  reorder_point: z.number().int().min(0).optional(),
  reorder_quantity: z.number().int().min(0).optional(),
  unit_of_measure: z.string().optional(),
  is_active: z.boolean().optional(),
  is_tracked: z.boolean().optional(),
})

export async function updateProduct(
  productId: string,
  data: Partial<z.infer<typeof updateSchema>>,
  options: {
    supabase?: Awaited<ReturnType<typeof resolveSupabase>>
    session?: Awaited<ReturnType<typeof resolveSession>>
    skipAccessCheck?: boolean
    revalidate?: (path: string) => void | Promise<void>
  } = {},
): Promise<ActionResult> {
  try {
    const supabase = await resolveSupabase(options)
    const session = await resolveSession(options)

    const { data: product } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from(PRODUCTS_TABLE)
      .select('salon_id')
      .eq('id', productId)
      .single<{ salon_id: string | null }>()

    if (!product?.salon_id) {
      return { error: 'Product not found' }
    }

    await ensureSalonAccess(product.salon_id, options.skipAccessCheck)

    const parsed = updateSchema.safeParse(data)
    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? 'Invalid product data' }
    }

    const sanitizedUpdate = sanitizePayload(parsed.data) as Partial<ProductUpdate>
    if (Object.keys(sanitizedUpdate).length === 0) {
      return { error: 'No valid fields provided for update' }
    }

    const { data: updated, error } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from(PRODUCTS_TABLE)
      .update({
        ...sanitizedUpdate,
        updated_by_id: session.user.id,
      })
      .eq('id', productId)
      .select()
      .single()

    if (error) throw error

    const revalidate = options.revalidate ?? revalidateInventory
    await revalidate('/business/inventory')

    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating product:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update product',
    }
  }
}
