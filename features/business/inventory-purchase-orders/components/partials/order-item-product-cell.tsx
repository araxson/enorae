'use client'

import { Badge } from '@/components/ui/badge'
import { TableCell } from '@/components/ui/table'
import { Package } from 'lucide-react'
import type { PurchaseOrderWithDetails } from '../../api/queries'

const COMPLETE_BADGE_CLASSES = 'text-primary border-primary'

const renderBadge = (isComplete: boolean) =>
  isComplete ? (
    <Badge variant="outline" className={COMPLETE_BADGE_CLASSES}>
      <Package className="h-3 w-3 mr-1" />
      Complete
    </Badge>
  ) : null

type Props = {
  item: NonNullable<PurchaseOrderWithDetails['items']>[number]
  ordered: number
  received: number
}

export function OrderItemProductCell({ item, ordered, received }: Props) {
  return (
    <TableCell>
      <div className="flex items-center gap-2">
        {item.product?.name || 'Unknown'}
        {renderBadge(received >= ordered)}
      </div>
    </TableCell>
  )
}
