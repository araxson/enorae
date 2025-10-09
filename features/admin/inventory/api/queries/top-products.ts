'use server'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { AdminInventory, TopProduct } from './types'

export async function getTopProducts(limit = 20): Promise<TopProduct[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select('*')
    .is('deleted_at', null)

  if (error) {
    console.error('admin_inventory_overview error in getTopProducts:', error)
    return []
  }

  const inventory = (data || []) as AdminInventory[]

  const productMap = new Map<
    string,
    { id: string; name: string; sku: string | null; quantity: number; salons: Set<string> }
  >()

  inventory.forEach((item) => {
    if (!item.id || !item.salon_id) return

    const key = item.product_name + (item.sku || '')
    if (!productMap.has(key)) {
      productMap.set(key, {
        id: item.id,
        name: item.product_name || 'Unknown',
        sku: item.sku,
        quantity: 0,
        salons: new Set(),
      })
    }

    const entry = productMap.get(key)!
    entry.quantity += item.total_quantity || 0
    entry.salons.add(item.salon_id)
  })

  return Array.from(productMap.values())
    .map((entry) => ({
      productId: entry.id,
      productName: entry.name,
      productSku: entry.sku,
      totalQuantity: entry.quantity,
      salonsCount: entry.salons.size,
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit)
}
