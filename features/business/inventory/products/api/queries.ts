import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// Type definitions - Use public views (not schema tables)
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
  current_stock?: number | null
  available_stock?: number | null
  product_id?: string | null
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
  // Auth check
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

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
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

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
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

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
 * IMPROVED: Filter on product_id instead of nested product.salon_id
 */
export async function getStockLevels(salonId?: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // If filtering by salon, first get product IDs for that salon
  let productIds: string[] | undefined
  if (salonId) {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('salon_id', salonId)

    if (productsError) throw productsError

    const productList = (products || []) as Array<{ id: string }>
    productIds = productList.map(p => p.id)
    if (!productIds.length) return []
  }

  const query = supabase
    .from('stock_levels')
    .select(`
      *,
      product:products(*)
    `)
    .order('current_stock', { ascending: true })

  if (productIds) {
    query.in('product_id', productIds)
  }

  const { data, error } = await query

  if (error) throw error
  return data as StockLevelWithProduct[]
}

/**
 * Get active stock alerts for a salon
 * IMPROVED: Filter on product_id instead of nested product.salon_id
 */
export async function getStockAlerts(salonId?: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // If filtering by salon, first get product IDs for that salon
  let productIds: string[] | undefined
  if (salonId) {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('salon_id', salonId)

    if (productsError) throw productsError

    const productList = (products || []) as Array<{ id: string }>
    productIds = productList.map(p => p.id)
    if (!productIds.length) return []
  }

  const query = supabase
    .from('stock_alerts')
    .select(`
      *,
      product:products(*)
    `)
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })

  if (productIds) {
    query.in('product_id', productIds)
  }

  const { data, error } = await query

  if (error) throw error
  return data as StockAlertWithProduct[]
}

/**
 * Get suppliers for a salon
 */
export async function getSuppliers(salonId?: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

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
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

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
 * IMPROVED: Filter in application layer instead of nested filter
 */
export async function getLowStockProducts(salonId?: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Get products for the salon
  let productIds: string[] | undefined
  const productsQuery = supabase
    .from('products')
    .select('id, reorder_point')
    .not('reorder_point', 'is', null)

  if (salonId) {
    productsQuery.eq('salon_id', salonId)
  }

  const { data: products, error: productsError } = await productsQuery

  if (productsError) throw productsError

  const productList = (products || []) as Array<{ id: string; reorder_point: number | null }>
  if (!productList.length) return []

  productIds = productList.map(p => p.id)

  // Get stock levels for these products
  const { data, error } = await supabase
    .from('stock_levels')
    .select(`
      *,
      product:products(*)
    `)
    .in('product_id', productIds)
    .order('current_stock', { ascending: true })

  if (error) throw error

  // Filter in application layer for low stock
  const lowStockProducts = (data as StockLevelWithProduct[]).filter(stockLevel => {
    const product = productList.find(p => p.id === stockLevel.product_id)
    const currentStock = stockLevel.current_stock || stockLevel.available_stock || 0
    const reorderPoint = product?.reorder_point || 0
    return currentStock < reorderPoint
  })

  return lowStockProducts
}

/**
 * Get inventory summary stats
 */
export async function getInventoryStats(salonId: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

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
 * IMPROVED: Uses centralized requireUserSalonId() helper
 */
export async function getInventorySalon(): Promise<{ id: string }> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon ID (throws if not found)
  const salonId = await requireUserSalonId()

  return { id: salonId }
}
