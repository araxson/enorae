import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// FIXED: Use admin_inventory_overview view
type AdminInventory = Database['public']['Views']['admin_inventory_overview']['Row']

export type InventorySummary = {
  totalProducts: number
  totalStockValue: number
  lowStockAlerts: number
  criticalStockAlerts: number
  activeSalons: number
}

export type LowStockAlert = {
  productId: string
  productName: string
  productSku: string | null
  salonId: string
  salonName: string
  locationName: string
  currentQuantity: number
  lowThreshold: number | null
  criticalThreshold: number | null
  alertLevel: 'low' | 'critical'
}

export type SalonInventoryValue = {
  salonId: string
  salonName: string
  totalProducts: number
  totalQuantity: number
  estimatedValue: number
}

export type TopProduct = {
  productId: string
  productName: string
  productSku: string | null
  totalQuantity: number
  salonsCount: number
}

/**
 * Get platform-wide inventory summary
 * IMPROVED: Uses admin_inventory_overview for aggregated data
 */
export async function getInventorySummary(): Promise<InventorySummary> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // ✅ FIXED: Query view once instead of multiple queries
  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select('*')
    .is('deleted_at', null)

  if (error) throw error

  const inventory = (data || []) as AdminInventory[]

  // Aggregate from view data
  const totalProducts = inventory.length
  const totalStockValue = inventory.reduce(
    (sum, item) => sum + ((item.total_quantity || 0) * (item.cost_price || 0)),
    0
  )

  // Count unique salons with inventory
  const activeSalons = new Set(inventory.map(item => item.salon_id)).size

  // Low stock: has reorder_point and total_available <= reorder_point
  const lowStockAlerts = inventory.filter(item =>
    item.reorder_point !== null &&
    (item.total_available || 0) <= item.reorder_point &&
    (item.total_available || 0) > 0
  ).length

  // Critical stock: total_available = 0 OR active_alerts_count > 0
  const criticalStockAlerts = inventory.filter(item =>
    item.total_available === 0 || (item.active_alerts_count || 0) > 0
  ).length

  return {
    totalProducts,
    totalStockValue,
    lowStockAlerts,
    criticalStockAlerts,
    activeSalons,
  }
}

/**
 * Get low stock alerts across all salons
 * IMPROVED: Uses admin_inventory_overview (eliminates N*3 queries!)
 */
export async function getLowStockAlerts(limit = 50): Promise<LowStockAlert[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // ✅ FIXED: Single query to view with all data pre-joined
  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select('*')
    .is('deleted_at', null)
    .order('total_available', { ascending: true })
    .limit(limit * 2) // Get more to filter by alert level

  if (error) throw error
  if (!data) return []

  const inventory = data as AdminInventory[]

  // Filter and map to alerts (all data already in view!)
  const alerts: LowStockAlert[] = inventory
    .map(item => {
      const qty = item.total_available || 0
      const lowThreshold = item.reorder_point
      const criticalThreshold = (item.active_alerts_count || 0) > 0 ? qty : null

      let alertLevel: 'low' | 'critical' | null = null

      // Critical: has active alerts or qty is 0
      if ((item.active_alerts_count || 0) > 0 || qty === 0) {
        alertLevel = 'critical'
      }
      // Low: below reorder point but not critical
      else if (lowThreshold !== null && qty <= lowThreshold) {
        alertLevel = 'low'
      }

      if (!alertLevel) return null

      return {
        productId: item.id,
        productName: item.product_name || 'Unknown',
        productSku: item.sku,
        salonId: item.salon_id,
        salonName: item.salon_name || 'Unknown',
        locationName: 'Multiple Locations', // View aggregates across locations
        currentQuantity: qty,
        lowThreshold,
        criticalThreshold,
        alertLevel,
      }
    })
    .filter((alert): alert is LowStockAlert => alert !== null)
    .slice(0, limit)

  // Sort: critical first, then by quantity
  return alerts.sort((a, b) => {
    if (a.alertLevel === 'critical' && b.alertLevel !== 'critical') return -1
    if (a.alertLevel !== 'critical' && b.alertLevel === 'critical') return 1
    return a.currentQuantity - b.currentQuantity
  })
}

/**
 * Get inventory value by salon
 * IMPROVED: Uses admin_inventory_overview (eliminates N*2 queries!)
 */
export async function getSalonInventoryValues(): Promise<SalonInventoryValue[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // ✅ FIXED: Single query to view, group by salon_id in app layer
  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select('*')
    .is('deleted_at', null)

  if (error) throw error
  if (!data) return []

  const inventory = data as AdminInventory[]

  // Group by salon_id and aggregate
  const salonMap = new Map<string, {
    salonName: string
    productCount: number
    totalQuantity: number
    totalValue: number
  }>()

  inventory.forEach(item => {
    if (!item.salon_id) return

    const existing = salonMap.get(item.salon_id) || {
      salonName: item.salon_name || 'Unknown',
      productCount: 0,
      totalQuantity: 0,
      totalValue: 0,
    }

    existing.productCount += 1
    existing.totalQuantity += item.total_quantity || 0
    existing.totalValue += (item.total_quantity || 0) * (item.cost_price || 0)

    salonMap.set(item.salon_id, existing)
  })

  // Convert to array
  const salonValues: SalonInventoryValue[] = Array.from(salonMap.entries()).map(
    ([salonId, data]) => ({
      salonId,
      salonName: data.salonName,
      totalProducts: data.productCount,
      totalQuantity: data.totalQuantity,
      estimatedValue: data.totalValue,
    })
  )

  return salonValues.sort((a, b) => b.estimatedValue - a.estimatedValue)
}

/**
 * Get top products across platform
 * IMPROVED: Uses admin_inventory_overview (eliminates N queries!)
 */
export async function getTopProducts(limit = 20): Promise<TopProduct[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // ✅ FIXED: Single query to view with all data
  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select('*')
    .is('deleted_at', null)

  if (error) throw error
  if (!data) return []

  const inventory = data as AdminInventory[]

  // Group by product name + SKU (same product across salons)
  const productMap = new Map<
    string,
    { id: string; name: string; sku: string | null; quantity: number; salons: Set<string> }
  >()

  inventory.forEach(item => {
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

  // Convert to array and sort by quantity
  const topProducts: TopProduct[] = Array.from(productMap.entries())
    .map(([, data]) => ({
      productId: data.id,
      productName: data.name,
      productSku: data.sku,
      totalQuantity: data.quantity,
      salonsCount: data.salons.size,
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit)

  return topProducts
}
