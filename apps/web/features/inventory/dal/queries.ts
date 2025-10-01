import { createClient } from '@/lib/supabase/client'
import type { Database } from '@enorae/database/types'

export async function getProducts(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_categories!inner(name),
      inventory!inner(
        quantity,
        reorder_point,
        last_restocked
      )
    `)
    .eq('salon_id', salonId)
    .order('name')

  if (error) throw error
  return data
}

export async function getSuppliers(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('salon_id', salonId)
    .order('name')

  if (error) throw error
  return data
}

export async function getInventoryLevels(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products!inner(
        name,
        sku,
        unit_price
      )
    `)
    .eq('products.salon_id', salonId)
    .order('products.name')

  if (error) throw error
  return data
}

export async function getLowStockProducts(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products!inner(
        name,
        sku
      )
    `)
    .eq('products.salon_id', salonId)
    .lt('quantity', 'reorder_point')

  if (error) throw error
  return data
}

export async function getProductCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}