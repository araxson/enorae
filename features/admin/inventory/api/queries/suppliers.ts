'use server'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { AdminInventory, SupplierOverviewItem } from './types'

export async function getSupplierOverview(): Promise<SupplierOverviewItem[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select(
      'id, supplier_name, salon_id, total_quantity, cost_price, active_alerts_count',
    )
    .is('deleted_at', null)

  if (error) {
    console.error('admin_inventory_overview error in getSupplierOverview:', error)
    return []
  }

  const inventory = (data || []) as AdminInventory[]

  type Aggregate = {
    supplierName: string
    productIds: Set<string>
    salonIds: Set<string>
    totalQuantity: number
    stockValue: number
    activeAlerts: number
  }

  const supplierMap = new Map<string, Aggregate>()

  inventory.forEach((item) => {
    const supplierKey = item.supplier_name?.trim() || 'Unassigned supplier'

    const existing = supplierMap.get(supplierKey) ?? {
      supplierName: supplierKey,
      productIds: new Set<string>(),
      salonIds: new Set<string>(),
      totalQuantity: 0,
      stockValue: 0,
      activeAlerts: 0,
    }

    if (item.id) existing.productIds.add(item.id)
    if (item.salon_id) existing.salonIds.add(item.salon_id)

    const quantity = item.total_quantity ?? 0
    const costPrice = item.cost_price ?? 0
    const alerts = item.active_alerts_count ?? 0

    existing.totalQuantity += quantity
    existing.stockValue += quantity * costPrice
    existing.activeAlerts += alerts

    supplierMap.set(supplierKey, existing)
  })

  return Array.from(supplierMap.values())
    .map<SupplierOverviewItem>((item) => ({
      supplierName: item.supplierName,
      productCount: item.productIds.size,
      salonCount: item.salonIds.size,
      totalQuantity: item.totalQuantity,
      stockValue: item.stockValue,
      activeAlerts: item.activeAlerts,
    }))
    .sort((a, b) => b.stockValue - a.stockValue)
}
