'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import type { PurchaseOrderWithDetails } from '../../api/queries'
import { formatCurrency } from '../utils/order-formatters'
import { OrderItemProductCell } from './order-item-product-cell'
import { OrderItemReceiveCell } from './order-item-receive-cell'

type OrderItemRowProps = {
  item: NonNullable<PurchaseOrderWithDetails['items']>[number]
  showReceiveColumn: boolean
  receivingQuantity: number | ''
  onQuantityChange: (itemId: string, nextQuantity: number) => void
}

const computeOrderedQuantity = (item: OrderItemRowProps['item']) => item.quantity_ordered ?? 0
const computeReceivedQuantity = (item: OrderItemRowProps['item']) => item.quantity_received ?? 0

const buildClassNames = (received: number, ordered: number) =>
  received >= ordered ? 'text-green-600 font-medium' : ''

export function OrderItemRow({
  item,
  showReceiveColumn,
  receivingQuantity,
  onQuantityChange,
}: OrderItemRowProps) {
  const ordered = computeOrderedQuantity(item)
  const received = computeReceivedQuantity(item)
  const remaining = ordered - received
  const itemId = item.id ?? ''

  const handleReceiveQuantity = (nextItemId: string, nextQuantity: number) => {
    if (!itemId || itemId !== nextItemId) {
      return
    }

    onQuantityChange(itemId, Math.min(nextQuantity, remaining))
  }

  return (
    <TableRow>
      <OrderItemProductCell item={item} ordered={ordered} received={received} />
      <TableCell>
        <code className="text-xs">{item.product?.sku || 'N/A'}</code>
      </TableCell>
      <TableCell className="text-right">{ordered}</TableCell>
      <TableCell className="text-right">
        <span className={buildClassNames(received, ordered)}>{received}</span>
      </TableCell>
      {showReceiveColumn && (
        <OrderItemReceiveCell
          remaining={remaining}
          itemId={itemId}
          receivingQuantity={receivingQuantity}
          onQuantityChange={handleReceiveQuantity}
        />
      )}
      <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
      <TableCell className="text-right font-medium">{formatCurrency(item.total_price || 0)}</TableCell>
    </TableRow>
  )
}
