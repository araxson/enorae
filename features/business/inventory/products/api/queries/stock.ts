import 'server-only'

import { createInventoryClient, requireBusinessRole, resolveAccessibleSalonIds } from './helpers'

import type { StockAlertWithProduct, StockLevelWithProduct } from './types'

export async function getStockLevels(salonId?: string) {
  await requireBusinessRole()

  const supabase = await createInventoryClient()
  const targetSalonIds = await resolveAccessibleSalonIds(salonId)
  if (!targetSalonIds.length) {
    return []
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .in('salon_id', targetSalonIds)

  if (productsError) throw productsError

  const productRecords = (products || []) as Array<{ id: string | null }>
  const productIds = productRecords
    .map((product) => product.id)
    .filter((id): id is string => Boolean(id))

  if (!productIds.length) return []

  const { data, error } = await supabase
    .from('stock_levels')
    .select(`
      *,
      product:products(*)
    `)
    .in('product_id', productIds)
    .order('current_stock', { ascending: true })

  if (error) throw error
  return (data || []) as StockLevelWithProduct[]
}

export async function getStockAlerts(salonId?: string) {
  await requireBusinessRole()

  const supabase = await createInventoryClient()
  const targetSalonIds = await resolveAccessibleSalonIds(salonId)
  if (!targetSalonIds.length) {
    return []
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .in('salon_id', targetSalonIds)

  if (productsError) throw productsError

  const productRecords = (products || []) as Array<{ id: string | null }>
  const productIds = productRecords
    .map((product) => product.id)
    .filter((id): id is string => Boolean(id))

  if (!productIds.length) return []

  const { data, error } = await supabase
    .from('stock_alerts')
    .select(`
      *,
      product:products(*)
    `)
    .eq('is_resolved', false)
    .in('product_id', productIds)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as StockAlertWithProduct[]
}
