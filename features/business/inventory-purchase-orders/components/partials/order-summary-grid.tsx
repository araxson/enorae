'use client'

import { format } from 'date-fns'
import { OrderStatusSelect } from './order-status-select'
import type { PurchaseOrderWithDetails } from '../../api/queries'

type Props = {
  order: PurchaseOrderWithDetails
  currentStatus: string
  onStatusChange: (value: string) => void
  isUpdating: boolean
}

export function OrderSummaryGrid({ order, currentStatus, onStatusChange, isUpdating }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Supplier</p>
          <p className="font-medium">{order.supplier?.name || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <OrderStatusSelect value={currentStatus} onChange={onStatusChange} disabled={isUpdating} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Order Date</p>
          <p className="font-medium">{format(new Date(order.ordered_at!), 'MMM dd, yyyy')}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expected Delivery</p>
          <p className="font-medium">
            {order.expected_delivery_at
              ? format(new Date(order.expected_delivery_at!), 'MMM dd, yyyy')
              : 'Not set'}
          </p>
        </div>
      </div>

      {order.notes && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Notes</p>
          <p className="text-sm">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
