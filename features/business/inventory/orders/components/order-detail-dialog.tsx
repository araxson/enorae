'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { updatePurchaseOrderStatus, receivePurchaseOrderItems } from '../api/mutations'
import type { PurchaseOrderWithDetails } from '../api/queries'
import { format } from 'date-fns'
import { Package } from 'lucide-react'

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
  const [isReceiving, setIsReceiving] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(order?.status || 'pending')
  const [receivingQuantities, setReceivingQuantities] = useState<Record<string, number>>({})

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return

    setIsUpdating(true)
    const formData = new FormData()
    formData.append('id', order.id || '')
    formData.append('status', newStatus)

    try {
      const result = await updatePurchaseOrderStatus(formData)
      if (result.error) {
        alert(result.error)
      } else {
        setCurrentStatus(newStatus)
      }
    } catch {
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReceiveItems = async () => {
    if (!order?.id || !order.items) return

    setIsReceiving(true)
    const formData = new FormData()
    formData.append('orderId', order.id)

    const items = order.items.map((item) => ({
      id: item.id!,
      quantityReceived: receivingQuantities[item.id!] ?? item.quantity_received ?? 0,
    }))

    formData.append('items', JSON.stringify(items))

    try {
      const result = await receivePurchaseOrderItems(formData)
      if (result.error) {
        alert(result.error)
      } else {
        setReceivingQuantities({})
        onOpenChange(false)
      }
    } catch {
      alert('Failed to receive items')
    } finally {
      setIsReceiving(false)
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const canReceiveItems = currentStatus === 'ordered' || currentStatus === 'approved'
  const hasUnreceivedItems = order?.items?.some((item) => {
    const received = item.quantity_received ?? 0
    const ordered = item.quantity_ordered ?? 0
    return received < ordered
  })

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Purchase Order Details</DialogTitle>
          <DialogDescription>
            Order from {format(new Date(order.ordered_at!), 'MMM dd, yyyy')}
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
                {format(new Date(order.ordered_at!), 'MMM dd, yyyy')}
              </p>
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

          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Ordered</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  {canReceiveItems && hasUnreceivedItems && (
                    <TableHead className="text-right">Receive Qty</TableHead>
                  )}
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items?.map((item) => {
                  const ordered = item.quantity_ordered ?? 0
                  const received = item.quantity_received ?? 0
                  const remaining = ordered - received

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.product?.name || 'Unknown'}
                          {received >= ordered && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Package className="h-3 w-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs">{item.product?.sku || 'N/A'}</code>
                      </TableCell>
                      <TableCell className="text-right">{ordered}</TableCell>
                      <TableCell className="text-right">
                        <span className={received >= ordered ? 'text-green-600 font-medium' : ''}>
                          {received}
                        </span>
                      </TableCell>
                      {canReceiveItems && hasUnreceivedItems && (
                        <TableCell className="text-right">
                          {remaining > 0 ? (
                            <Input
                              type="number"
                              min={0}
                              max={remaining}
                              placeholder={String(remaining)}
                              value={receivingQuantities[item.id!] ?? ''}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0
                                setReceivingQuantities((prev) => ({
                                  ...prev,
                                  [item.id!]: Math.min(value, remaining),
                                }))
                              }}
                              className="w-20 h-8"
                            />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total_price || 0)}
                      </TableCell>
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell colSpan={canReceiveItems && hasUnreceivedItems ? 6 : 5} className="text-right font-semibold">
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

        {canReceiveItems && hasUnreceivedItems && (
          <DialogFooter>
            <Button onClick={handleReceiveItems} disabled={isReceiving}>
              {isReceiving ? 'Receiving...' : 'Receive Items'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
