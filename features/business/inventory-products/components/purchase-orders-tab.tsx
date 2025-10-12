'use client'

import { useState } from 'react'
import { OrderList } from '@/features/business/inventory-purchase-orders/components/order-list'
import { OrderDetailDialog } from '@/features/business/inventory-purchase-orders/components/order-detail-dialog'
import type { PurchaseOrderWithDetails } from '@/features/business/inventory-purchase-orders/api/queries'

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
        onOpenChange={(open: boolean) => {
          if (!open) {
            setSelectedOrder(null)
          }
        }}
      />
    </>
  )
}
