import { getPurchaseOrders, getPurchaseOrderReferenceData } from './api/queries'
import { PurchaseOrdersClient } from './components/purchase-orders-client'

export async function PurchaseOrders() {
  const [orders, referenceData] = await Promise.all([
    getPurchaseOrders(),
    getPurchaseOrderReferenceData(),
  ])

  return (
    <PurchaseOrdersClient
      initialOrders={orders}
      suppliers={referenceData.suppliers}
      products={referenceData.products}
    />
  )
}
