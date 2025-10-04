'use client'

import { useState } from 'react'
import { OrderList } from '../../orders/components/order-list'
import { OrderDetailDialog } from '../../orders/components/order-detail-dialog'
import type { PurchaseOrderWithDetails } from '../../orders/api/queries'

type PurchaseOrdersTabProps = {
  orders: PurchaseOrderWithDetails[]
}

export function PurchaseOrdersTab({ orders }: PurchaseOrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrderWithDetails | null>(
    null
  )

  return (
    <>
      <OrderList orders={orders} onView={setSelectedOrder} />
      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      />
    </>
  )
}
