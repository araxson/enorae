import { PurchaseOrders } from '@/features/business/inventory/orders'

export const metadata = {
  title: 'Purchase Orders',
  description: 'Manage inventory purchase orders',
}

export default async function PurchaseOrdersPage() {
  return <PurchaseOrders />
}
