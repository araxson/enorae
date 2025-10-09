"use client"

import { ArrowRightLeft, Plus } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

import type { StockLevelWithLocation } from '../../api/stock-queries'

import { StockStatusBadge, getStockStatus } from './stock-status'
import type { TransferSelection, AdjustSelection } from './types'

type StockLevelsTableViewProps = {
  stockLevels: StockLevelWithLocation[]
  showActions: boolean
  onTransferClick: (selection: TransferSelection) => void
  onAdjustClick: (selection: AdjustSelection) => void
}

export function StockLevelsTableView({
  stockLevels,
  showActions,
  onTransferClick,
  onAdjustClick,
}: StockLevelsTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Available</TableHead>
          <TableHead className="text-right">Reserved</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="hidden md:table-cell text-right">Last Counted</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead className="text-center">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {stockLevels.map((level) => {
          const availableQuantity = level.available_quantity ?? level.quantity ?? 0
          const reservedQuantity = level.reserved_quantity ?? 0
          const totalQuantity = level.quantity ?? availableQuantity + reservedQuantity
          const status = getStockStatus(availableQuantity)
          const productName = level.product?.name || 'Unknown product'
          const sku = level.product?.sku || null
          const locationName = level.location?.name || 'Unknown location'
          const lastCounted = level.last_counted_at
            ? new Date(level.last_counted_at).toLocaleDateString()
            : '—'

          return (
            <TableRow key={`${level.product_id}-${level.location_id}`}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{productName}</span>
                  {sku && (
                    <span className="text-muted-foreground text-xs">SKU: {sku}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{locationName}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">{availableQuantity}</TableCell>
              <TableCell className="text-right text-muted-foreground">{reservedQuantity}</TableCell>
              <TableCell className="text-right text-muted-foreground">{totalQuantity}</TableCell>
              <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                {lastCounted}
              </TableCell>
              <TableCell>
                <StockStatusBadge status={status} />
              </TableCell>
              {showActions && (
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={availableQuantity === 0 || !level.product_id || !level.location_id}
                      onClick={() =>
                        level.product_id &&
                        level.location_id &&
                        onTransferClick({
                          productId: level.product_id,
                          productName,
                          fromLocationId: level.location_id,
                          fromLocationName: locationName,
                          availableQuantity,
                        })
                      }
                      title="Transfer stock"
                    >
                      <ArrowRightLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!level.product_id || !level.location_id}
                      onClick={() =>
                        level.product_id &&
                        level.location_id &&
                        onAdjustClick({
                          productId: level.product_id,
                          productName,
                          locationId: level.location_id,
                          locationName,
                          currentQuantity: totalQuantity,
                        })
                      }
                      title="Adjust stock"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
