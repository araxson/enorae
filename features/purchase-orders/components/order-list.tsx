'use client'

import { useState } from 'react'
import { Eye, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deletePurchaseOrder } from '../actions/purchase-orders.actions'
import type { PurchaseOrderWithDetails } from '../dal/purchase-orders.queries'
import { format } from 'date-fns'

type OrderListProps = {
  orders: PurchaseOrderWithDetails[]
  onView?: (order: PurchaseOrderWithDetails) => void
}

const STATUS_COLORS = {
  pending: 'secondary',
  approved: 'default',
  ordered: 'default',
  received: 'default',
  cancelled: 'destructive',
} as const

export function OrderList({ orders, onView }: OrderListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const formData = new FormData()
    formData.append('id', deleteId)

    try {
      const result = await deletePurchaseOrder(formData)
      if (result.error) {
        alert(result.error)
      }
    } catch (error) {
      alert('Failed to delete order')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No purchase orders found</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Date</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Expected Delivery</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                {format(new Date(order.ordered_at), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{order.supplier?.name || 'Unknown'}</TableCell>
              <TableCell>{order.items?.length || 0} items</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(order.total_amount)}
              </TableCell>
              <TableCell>
                {order.expected_delivery_at
                  ? format(new Date(order.expected_delivery_at), 'MMM dd, yyyy')
                  : 'Not set'}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(order)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
