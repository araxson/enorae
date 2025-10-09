'use server'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { AdminInventory, SalonInventoryValue } from './types'

export async function getSalonInventoryValues(): Promise<SalonInventoryValue[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select('*')
    .is('deleted_at', null)

  if (error) {
    console.error('admin_inventory_overview error in getSalonInventoryValues:', error)
    return []
  }

  const inventory = (data || []) as AdminInventory[]

  const salonMap = new Map<
    string,
    { salonName: string; productCount: number; totalQuantity: number; totalValue: number }
  >()

  inventory.forEach((item) => {
    if (!item.salon_id) return

    const entry = salonMap.get(item.salon_id) || {
      salonName: item.salon_name || 'Unknown',
      productCount: 0,
      totalQuantity: 0,
      totalValue: 0,
    }

    entry.productCount += 1
    entry.totalQuantity += item.total_quantity || 0
    entry.totalValue += (item.total_quantity || 0) * (item.cost_price || 0)

    salonMap.set(item.salon_id, entry)
  })

  return Array.from(salonMap.entries())
    .map(([salonId, entry]) => ({
      salonId,
      salonName: entry.salonName,
      totalProducts: entry.productCount,
      totalQuantity: entry.totalQuantity,
      estimatedValue: entry.totalValue,
    }))
    .sort((a, b) => b.estimatedValue - a.estimatedValue)
}
