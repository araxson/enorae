'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import type { PurchaseOrderWithDetails } from '../api/queries'
import { OrderSummaryGrid } from './partials/order-summary-grid'
import { OrderItemsTable } from './partials/order-items-table'
import { ReceiveItemsFooter } from './partials/receive-items-footer'
import { useOrderDetail } from './hooks/use-order-detail'

export type OrderDetailDialogProps = {
  order: PurchaseOrderWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {order ? <OrderDetailDialogContent order={order} onOpenChange={onOpenChange} /> : null}
    </Dialog>
  )
}

function OrderDetailDialogContent({
  order,
  onOpenChange,
}: {
  order: PurchaseOrderWithDetails
  onOpenChange: (open: boolean) => void
}) {
  const {
    currentStatus,
    isUpdating,
    isReceiving,
    receivingQuantities,
    canReceiveItems,
    hasUnreceivedItems,
    handleStatusChange,
    handleQuantityChange,
    handleReceiveItems,
  } = useOrderDetail({ order, onClose: onOpenChange })

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Purchase Order Details</DialogTitle>
        <DialogDescription>
          Order from {format(new Date(order.ordered_at!), 'MMM dd, yyyy')}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <OrderSummaryGrid
          order={order}
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
          isUpdating={isUpdating}
        />

        <OrderItemsTable
          items={order.items}
          canReceiveItems={canReceiveItems}
          hasUnreceivedItems={!!hasUnreceivedItems}
          receivingQuantities={receivingQuantities}
          onQuantityChange={handleQuantityChange}
          totalAmount={order.total_amount}
        />
      </div>

      {canReceiveItems && hasUnreceivedItems && (
        <ReceiveItemsFooter onSubmit={handleReceiveItems} isSubmitting={isReceiving} />
      )}
    </DialogContent>
  )
}
