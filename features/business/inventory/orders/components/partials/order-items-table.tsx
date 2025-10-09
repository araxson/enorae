'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PurchaseOrderWithDetails } from '../../api/queries'
import { formatCurrency } from '../utils/order-formatters'
import { OrderItemRow } from './order-item-row'

type Props = {
  items: PurchaseOrderWithDetails['items']
  canReceiveItems: boolean
  hasUnreceivedItems: boolean
  receivingQuantities: Record<string, number>
  onQuantityChange: (itemId: string, nextQuantity: number) => void
  totalAmount: number | null
}

export function OrderItemsTable({
  items,
  canReceiveItems,
  hasUnreceivedItems,
  receivingQuantities,
  onQuantityChange,
  totalAmount,
}: Props) {
  const orderItems = items ?? []
  const showReceiveColumn = canReceiveItems && hasUnreceivedItems

  return (
    <div>
      <h3 className="font-semibold mb-2">Order Items</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Ordered</TableHead>
            <TableHead className="text-right">Received</TableHead>
            {showReceiveColumn && <TableHead className="text-right">Receive Qty</TableHead>}
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItems.map((item, index) => (
            <OrderItemRow
              key={item.id ?? `order-item-${index}`}
              item={item}
              showReceiveColumn={showReceiveColumn}
              receivingQuantity={item.id ? receivingQuantities[item.id] ?? '' : ''}
              onQuantityChange={onQuantityChange}
            />
          ))}
          <TableRow>
            <TableCell colSpan={showReceiveColumn ? 6 : 5} className="text-right font-semibold">
              Total
            </TableCell>
            <TableCell className="text-right font-semibold">{formatCurrency(totalAmount)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
