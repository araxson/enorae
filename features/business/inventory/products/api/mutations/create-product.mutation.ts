'use server'

import { z } from 'zod'
import { resolveSupabase, resolveSession, ensureSalonAccess, sanitizePayload, revalidateInventory } from './product-mutation-shared'
import type { Database } from '@/lib/types/database.types'
import type { ActionResult } from './helpers'

type ProductInsert = Database['inventory']['Tables']['products']['Insert']

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
  category_id: z.string().uuid().optional(),
  supplier_id: z.string().uuid().optional(),
  cost_price: z.number().min(0).optional(),
  retail_price: z.number().min(0).optional(),
  reorder_point: z.number().int().min(0).optional(),
  reorder_quantity: z.number().int().min(0).optional(),
  unit_of_measure: z.string().optional(),
  is_active: z.boolean().default(true),
  is_tracked: z.boolean().default(true),
})

export async function createProduct(
  salonId: string,
  data: z.infer<typeof productSchema>,
  options: {
    supabase?: Awaited<ReturnType<typeof resolveSupabase>>
    session?: Awaited<ReturnType<typeof resolveSession>>
    skipAccessCheck?: boolean
    revalidate?: (path: string) => void | Promise<void>
  } = {},
): Promise<ActionResult> {
  try {
    await ensureSalonAccess(salonId, options.skipAccessCheck)

    const validated = productSchema.safeParse(data)
    if (!validated.success) {
      return { error: validated.error.errors[0]?.message ?? 'Invalid product data' }
    }

    const supabase = await resolveSupabase(options)
    const session = await resolveSession(options)

    const sanitized = sanitizePayload(validated.data) as Partial<ProductInsert>
    const payload: ProductInsert = {
      salon_id: salonId,
      name: validated.data.name,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
      ...sanitized,
    }

    const { data: product, error } = await supabase
      .schema('inventory')
      .from('products')
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    const revalidate = options.revalidate ?? revalidateInventory
    await revalidate('/business/inventory')

    return { success: true, data: product }
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create product',
    }
  }
}
