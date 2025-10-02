import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Type definitions
type Product = Database['public']['Views']['products']['Row']
type ProductCategory = Database['public']['Views']['product_categories']['Row']
type StockLevel = Database['public']['Views']['stock_levels']['Row']
type StockAlert = Database['public']['Views']['stock_alerts']['Row']
type Supplier = Database['public']['Views']['suppliers']['Row']
type PurchaseOrder = Database['public']['Views']['purchase_orders']['Row']

// Relationship types
export type ProductWithRelations = Product & {
  category: ProductCategory | null
  supplier: Supplier | null
  stock_levels: StockLevel[]
}

export type StockLevelWithProduct = StockLevel & {
  product: Product | null
}

export type StockAlertWithProduct = StockAlert & {
  product: Product | null
}

export type PurchaseOrderWithSupplier = PurchaseOrder & {
  supplier: Supplier | null
  purchase_order_items: Array<{
    id: string
    product_id: string
    quantity_ordered: number
    quantity_received: number | null
    unit_price: number
    total_price: number | null
    product: Product | null
  }>
}

/**
 * Get all products for a salon with stock levels
 */
export async function getProducts(salonId?: string) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*),
      supplier:suppliers(*),
      stock_levels(*)
    `)
    .is('deleted_at', null)
    .order('name')

  // Filter by salon if provided
  if (salonId) {
    query.eq('salon_id', salonId)
  }

  const { data, error } = await query

  if (error) throw error
  return data as ProductWithRelations[]
}

/**
 * Get a single product with full details
 */
export async function getProduct(productId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*),
      supplier:suppliers(*),
      stock_levels(*)
    `)
    .eq('id', productId)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data as ProductWithRelations
}

/**
 * Get product categories for a salon
 */
export async function getProductCategories(salonId?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name')

  if (salonId) {
    query.eq('salon_id', salonId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Get stock levels for all products in a salon
 */
export async function getStockLevels(salonId?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('stock_levels')
    .select(`
      *,
      product:products(*)
    `)
    .order('current_stock', { ascending: true })

  if (salonId) {
    query.eq('product.salon_id', salonId)
  }

  const { data, error } = await query

  if (error) throw error
  return data as StockLevelWithProduct[]
}

/**
 * Get active stock alerts for a salon
 */
export async function getStockAlerts(salonId?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('stock_alerts')
    .select(`
      *,
      product:products(*)
    `)
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })

  if (salonId) {
    query.eq('product.salon_id', salonId)
  }

  const { data, error } = await query

  if (error) throw error
  return data as StockAlertWithProduct[]
}

/**
 * Get suppliers for a salon
 */
export async function getSuppliers(salonId?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('suppliers')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (salonId) {
    query.eq('salon_id', salonId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Get purchase orders for a salon
 */
export async function getPurchaseOrders(salonId?: string, status?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('purchase_orders')
    .select(`
      *,
      supplier:suppliers(*),
      purchase_order_items(
        *,
        product:products(*)
      )
    `)
    .order('created_at', { ascending: false })

  if (salonId) {
    query.eq('salon_id', salonId)
  }

  if (status) {
    query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw error
  return data as PurchaseOrderWithSupplier[]
}

/**
 * Get low stock products (stock below reorder point)
 */
export async function getLowStockProducts(salonId?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('stock_levels')
    .select(`
      *,
      product:products(*)
    `)
    .filter('current_stock', 'lt', 'product.reorder_point')
    .order('current_stock', { ascending: true })

  if (salonId) {
    query.eq('product.salon_id', salonId)
  }

  const { data, error } = await query

  if (error) throw error
  return data as StockLevelWithProduct[]
}

/**
 * Get inventory summary stats
 */
export async function getInventoryStats(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get products count
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('salon_id', salonId)
    .is('deleted_at', null)

  // Get low stock count
  const { count: lowStockCount } = await supabase
    .from('stock_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('is_resolved', false)

  // Get active suppliers count
  const { count: suppliersCount } = await supabase
    .from('suppliers')
    .select('*', { count: 'exact', head: true })
    .eq('salon_id', salonId)
    .eq('is_active', true)

  // Get pending orders count
  const { count: pendingOrdersCount } = await supabase
    .from('purchase_orders')
    .select('*', { count: 'exact', head: true })
    .eq('salon_id', salonId)
    .eq('status', 'pending')

  return {
    productsCount: productsCount || 0,
    lowStockCount: lowStockCount || 0,
    suppliersCount: suppliersCount || 0,
    pendingOrdersCount: pendingOrdersCount || 0
  }
}

/**
 * Get salon for current user (for inventory management)
 */
export async function getInventorySalon() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: salon, error } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (error || !salon) {
    throw new Error('No salon found for your account')
  }

  return salon as { id: string }
}
