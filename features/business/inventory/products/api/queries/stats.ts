import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

export async function getInventoryStats(salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('salon_id', salonId)
    .is('deleted_at', null)

  const { count: lowStockCount } = await supabase
    .from('stock_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('salon_id', salonId)
    .eq('is_resolved', false)

  const { count: suppliersCount } = await supabase
    .from('suppliers')
    .select('*', { count: 'exact', head: true })
    .eq('salon_id', salonId)
    .eq('is_active', true)

  const { count: pendingOrdersCount } = await supabase
    .from('purchase_orders')
    .select('*', { count: 'exact', head: true })
    .eq('salon_id', salonId)
    .eq('status', 'pending')

  return {
    productsCount: productsCount || 0,
    lowStockCount: lowStockCount || 0,
    suppliersCount: suppliersCount || 0,
    pendingOrdersCount: pendingOrdersCount || 0,
  }
}

export async function getInventorySalon(): Promise<{ id: string }> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return { id: salonId }
}
