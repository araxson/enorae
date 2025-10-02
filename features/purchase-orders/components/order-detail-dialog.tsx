'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { updatePurchaseOrderStatus } from '../actions/purchase-orders.actions'
import type { PurchaseOrderWithDetails } from '../dal/purchase-orders.queries'
import { format } from 'date-fns'

type OrderDetailDialogProps = {
  order: PurchaseOrderWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(order?.status || 'pending')

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return

    setIsUpdating(true)
    const formData = new FormData()
    formData.append('id', order.id)
    formData.append('status', newStatus)

    try {
      const result = await updatePurchaseOrderStatus(formData)
      if (result.error) {
        alert(result.error)
      } else {
        setCurrentStatus(newStatus)
      }
    } catch (error) {
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Purchase Order Details</DialogTitle>
          <DialogDescription>
            Order from {format(new Date(order.ordered_at), 'MMM dd, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Supplier</p>
              <p className="font-medium">{order.supplier?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {format(new Date(order.ordered_at), 'MMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Delivery</p>
              <p className="font-medium">
                {order.expected_delivery_at
                  ? format(new Date(order.expected_delivery_at), 'MMM dd, yyyy')
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

          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <code className="text-xs">{item.product?.sku || 'N/A'}</code>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity_ordered}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unit_price)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.total_price)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(order.total_amount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
