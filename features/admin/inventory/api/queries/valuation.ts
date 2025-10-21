import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type {
  AdminInventory,
  InventoryValuationCategory,
  InventoryValuationSummary,
} from './types'

export async function getInventoryValuation(): Promise<InventoryValuationSummary> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select(
      'id, category_name, salon_id, total_quantity, cost_price, retail_price',
    )
    .is('deleted_at', null)

  if (error) {
    console.error('admin_inventory_overview error in getInventoryValuation:', error)
    return {
      totalStockValue: 0,
      totalRetailValue: 0,
      categories: [],
    }
  }

  const inventory = (data || []) as AdminInventory[]

  type Aggregate = {
    categoryName: string
    productIds: Set<string>
    salonIds: Set<string>
    stockValue: number
    retailValue: number
  }

  const categoryMap = new Map<string, Aggregate>()

  inventory.forEach((item) => {
    const categoryKey = item.category_name?.trim() || 'Uncategorized'
    const existing = categoryMap.get(categoryKey) ?? {
      categoryName: categoryKey,
      productIds: new Set<string>(),
      salonIds: new Set<string>(),
      stockValue: 0,
      retailValue: 0,
    }

    const quantity = item.total_quantity ?? 0
    const costPrice = item.cost_price ?? 0
    const retailPrice = item.retail_price ?? 0

    if (item.id) existing.productIds.add(item.id)
    if (item.salon_id) existing.salonIds.add(item.salon_id)

    existing.stockValue += quantity * costPrice
    existing.retailValue += quantity * retailPrice

    categoryMap.set(categoryKey, existing)
  })

  const totalStockValue = Array.from(categoryMap.values()).reduce(
    (sum, category) => sum + category.stockValue,
    0,
  )
  const totalRetailValue = Array.from(categoryMap.values()).reduce(
    (sum, category) => sum + category.retailValue,
    0,
  )

  const categories: InventoryValuationCategory[] = Array.from(categoryMap.values())
    .map((category) => ({
      categoryName: category.categoryName,
      productCount: category.productIds.size,
      salonCount: category.salonIds.size,
      stockValue: category.stockValue,
      retailValue: category.retailValue,
      contribution: totalStockValue > 0 ? category.stockValue / totalStockValue : 0,
    }))
    .sort((a, b) => b.stockValue - a.stockValue)

  return {
    totalStockValue,
    totalRetailValue,
    categories,
  }
}
