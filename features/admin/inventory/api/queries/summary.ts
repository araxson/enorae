import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { AdminInventory, InventorySummary } from './types'

export async function getInventorySummary(): Promise<InventorySummary> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select('*')
    .is('deleted_at', null)

  if (error) {
    console.error('admin_inventory_overview error:', error)
    return {
      totalProducts: 0,
      totalStockValue: 0,
      lowStockAlerts: 0,
      criticalStockAlerts: 0,
      activeSalons: 0,
    }
  }

  const inventory = (data || []) as AdminInventory[]

  const totalProducts = inventory.length
  const totalStockValue = inventory.reduce(
    (sum, item) => sum + ((item.total_quantity || 0) * (item.cost_price || 0)),
    0,
  )

  const activeSalons = new Set(inventory.map((item) => item.salon_id)).size

  const lowStockAlerts = inventory.filter((item) =>
    item.reorder_point !== null &&
    (item.total_available || 0) <= item.reorder_point &&
    (item.total_available || 0) > 0,
  ).length

  const criticalStockAlerts = inventory.filter((item) =>
    item.total_available === 0 || (item.active_alerts_count || 0) > 0,
  ).length

  return {
    totalProducts,
    totalStockValue,
    lowStockAlerts,
    criticalStockAlerts,
    activeSalons,
  }
}
