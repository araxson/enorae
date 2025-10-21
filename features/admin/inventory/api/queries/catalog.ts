import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { AdminInventory, ProductCatalogItem } from './types'

export async function getProductCatalog(limit = 100): Promise<ProductCatalogItem[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select(
      'id, product_name, sku, category_name, supplier_name, is_active, is_tracked, total_quantity, total_available, reorder_point, active_alerts_count, cost_price, retail_price, salon_id',
    )
    .is('deleted_at', null)

  if (error) {
    console.error('admin_inventory_overview error in getProductCatalog:', error)
    return []
  }

  const inventory = (data || []) as AdminInventory[]

  type Aggregate = {
    productId: string
    productName: string
    productSku: string | null
    categoryName: string | null
    supplierName: string | null
    isActive: boolean
    isTracked: boolean
    salonIds: Set<string>
    totalQuantity: number
    totalAvailable: number
    lowStockLocations: number
    activeAlerts: number
    costPrice: number
    retailPrice: number
    reorderPoint: number | null
  }

  const productMap = new Map<string, Aggregate>()

  inventory.forEach((item) => {
    if (!item.id) return

    const existing = productMap.get(item.id) ?? {
      productId: item.id,
      productName: item.product_name || 'Unknown product',
      productSku: item.sku,
      categoryName: item.category_name,
      supplierName: item.supplier_name,
      isActive: Boolean(item.is_active),
      isTracked: Boolean(item.is_tracked),
      salonIds: new Set<string>(),
      totalQuantity: 0,
      totalAvailable: 0,
      lowStockLocations: 0,
      activeAlerts: 0,
      costPrice: item.cost_price ?? 0,
      retailPrice: item.retail_price ?? 0,
      reorderPoint: item.reorder_point ?? null,
    }

    existing.productName = item.product_name || existing.productName
    existing.productSku = item.sku ?? existing.productSku
    existing.categoryName = item.category_name ?? existing.categoryName
    existing.supplierName = item.supplier_name ?? existing.supplierName
    existing.isActive = existing.isActive || Boolean(item.is_active)
    existing.isTracked = existing.isTracked || Boolean(item.is_tracked)

    if (item.cost_price !== null) existing.costPrice = item.cost_price
    if (item.retail_price !== null) existing.retailPrice = item.retail_price
    if (item.reorder_point !== null) {
      existing.reorderPoint =
        existing.reorderPoint === null
          ? item.reorder_point
          : Math.min(existing.reorderPoint, item.reorder_point)
    }

    const quantity = item.total_quantity ?? 0
    const available = item.total_available ?? 0
    const alerts = item.active_alerts_count ?? 0

    existing.totalQuantity += quantity
    existing.totalAvailable += available
    if (item.salon_id) {
      existing.salonIds.add(item.salon_id)
    }

    if (alerts > 0 || available === 0) {
      existing.activeAlerts += 1
    }
    if (item.reorder_point !== null && available <= item.reorder_point) {
      existing.lowStockLocations += 1
    }

    productMap.set(item.id, existing)
  })

  return Array.from(productMap.values())
    .map<ProductCatalogItem>((item) => ({
      productId: item.productId,
      productName: item.productName,
      productSku: item.productSku,
      categoryName: item.categoryName,
      supplierName: item.supplierName,
      isActive: item.isActive,
      isTracked: item.isTracked,
      salonCount: item.salonIds.size,
      totalQuantity: item.totalQuantity,
      totalAvailable: item.totalAvailable,
      lowStockLocations: item.lowStockLocations,
      activeAlerts: item.activeAlerts,
      stockValue: item.costPrice * item.totalQuantity,
      retailValue: item.retailPrice * item.totalQuantity,
      reorderPoint: item.reorderPoint,
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit)
}
