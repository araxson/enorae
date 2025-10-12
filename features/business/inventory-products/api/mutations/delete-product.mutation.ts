import { resolveSupabase, resolveSession, ensureSalonAccess, revalidateInventory } from './product-mutation-shared'
import type { ActionResult } from './helpers'

const INVENTORY_SCHEMA = 'inventory'
const PRODUCTS_TABLE = 'products'

export async function deleteProductMutation(
  productId: string,
  options: {
    supabase?: Awaited<ReturnType<typeof resolveSupabase>>
    session?: Awaited<ReturnType<typeof resolveSession>>
    skipAccessCheck?: boolean
    revalidate?: (path: string) => void | Promise<void>
    now?: () => Date
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

    const now = options.now?.() ?? new Date()

    const { error } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from(PRODUCTS_TABLE)
      .update({
        deleted_at: now.toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', productId)

    if (error) throw error

    const revalidate = options.revalidate ?? revalidateInventory
    await revalidate('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete product',
    }
  }
}
