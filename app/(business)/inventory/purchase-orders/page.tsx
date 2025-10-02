import { PurchaseOrders } from '@/features/purchase-orders'
import { getPurchaseOrders } from '@/features/purchase-orders/dal/purchase-orders.queries'

export const metadata = {
  title: 'Purchase Orders',
  description: 'Manage inventory purchase orders',
}

export default async function PurchaseOrdersPage() {
  const orders = await getPurchaseOrders()
  return <PurchaseOrders initialOrders={orders} />
}
