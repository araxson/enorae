import { getPurchaseOrders } from './api/queries'
import { PurchaseOrdersClient } from './components/purchase-orders-client'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Supplier = Database['public']['Views']['suppliers']['Row']
type Product = {
  id: string
  name: string | null
  cost_price: number | null
}

export async function PurchaseOrders() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const [orders, suppliers, products] = await Promise.all([
    getPurchaseOrders(),
    supabase
      .from('suppliers')
      .select('*')
      .eq('salon_id', salonId)
      .eq('is_active', true)
      .order('name')
      .then((res) => (res.data || []) as Supplier[]),
    supabase
      .from('inventory_overview')
      .select('*')
      .eq('salon_id', salonId)
      .order('name')
      .then((res) => (res.data || []) as Product[]),
  ])

  return <PurchaseOrdersClient initialOrders={orders} suppliers={suppliers} products={products} />
}
