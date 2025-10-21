import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { AdminInventory, LowStockAlert } from './types'

export async function getLowStockAlerts(limit = 50): Promise<LowStockAlert[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select('*')
    .is('deleted_at', null)
    .order('total_available', { ascending: true })
    .limit(limit * 2)

  if (error) {
    console.error('admin_inventory_overview error in getLowStockAlerts:', error)
    return []
  }

  const inventory = (data || []) as AdminInventory[]

  const alerts: LowStockAlert[] = inventory
    .map((item) => {
      const qty = item.total_available || 0
      const lowThreshold = item.reorder_point
      const hasCriticalAlert = (item.active_alerts_count || 0) > 0

      let alertLevel: 'low' | 'critical' | null = null

      if (hasCriticalAlert || qty === 0) {
        alertLevel = 'critical'
      } else if (lowThreshold !== null && qty <= lowThreshold) {
        alertLevel = 'low'
      }

      if (!alertLevel) return null

      return {
        productId: item.id,
        productName: item.product_name || 'Unknown',
        productSku: item.sku,
        salonId: item.salon_id,
        salonName: item.salon_name || 'Unknown',
        locationName: 'Multiple Locations',
        currentQuantity: qty,
        lowThreshold,
        criticalThreshold: hasCriticalAlert ? qty : null,
        alertLevel,
      }
    })
    .filter((alert): alert is LowStockAlert => alert !== null)
    .slice(0, limit)

  return alerts.sort((a, b) => {
    if (a.alertLevel === 'critical' && b.alertLevel !== 'critical') return -1
    if (a.alertLevel !== 'critical' && b.alertLevel === 'critical') return 1
    return a.currentQuantity - b.currentQuantity
  })
}
