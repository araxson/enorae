import 'server-only'

import { createInventoryClient, requireBusinessRole, resolveAccessibleSalonIds } from './helpers'
import type { ProductRow, ProductWithRelations } from './types'

export async function getProducts(salonId?: string) {
  await requireBusinessRole()

  const supabase = await createInventoryClient()
  const targetSalonIds = await resolveAccessibleSalonIds(salonId)
  if (!targetSalonIds.length) {
    return []
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*),
      supplier:suppliers(*),
      stock_levels(*)
    `)
    .is('deleted_at', null)
    .in('salon_id', targetSalonIds)
    .order('name')

  if (error) throw error
  return (data || []) as ProductWithRelations[]
}

export async function getProduct(productId: string) {
  await requireBusinessRole()

  const supabase = await createInventoryClient()
  const targetSalonIds = await resolveAccessibleSalonIds()
  if (!targetSalonIds.length) {
    throw new Error('No salon access')
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*),
      supplier:suppliers(*),
      stock_levels(*)
    `)
    .eq('id', productId)
    .in('salon_id', targetSalonIds)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  if (!data) {
    throw new Error('Product not found')
  }

  return data as ProductWithRelations
}

export async function getLowStockProducts(salonId?: string) {
  await requireBusinessRole()

  const supabase = await createInventoryClient()

  const targetSalonIds = await resolveAccessibleSalonIds(salonId)
  if (!targetSalonIds.length) {
    return []
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, reorder_point')
    .not('reorder_point', 'is', null)
    .in('salon_id', targetSalonIds)

  if (productsError) throw productsError

  const productList = (products || []) as Array<{ id: string; reorder_point: number | null }>
  if (!productList.length) return []

  const ids = productList.map((product) => product.id)

  const { data, error } = await supabase
    .from('stock_levels')
    .select(`
      *,
      product:products(*)
    `)
    .in('product_id', ids)
    .order('current_stock', { ascending: true })

  if (error) throw error

  const stockLevels = (data || []) as Array<{
    product_id: string | null
    current_stock: number | null
    available_stock: number | null
    product: ProductRow | null
  }>

  const lowStockProducts = stockLevels.filter((stockLevel) => {
    const product = productList.find((item) => item.id === stockLevel.product_id)
    if (!product) return false

    const currentStock = stockLevel.current_stock || stockLevel.available_stock || 0
    const reorderPoint = product.reorder_point || 0
    return currentStock < reorderPoint
  })

  return lowStockProducts
}
