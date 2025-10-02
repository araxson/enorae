'use client'

import { ArrowRight, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { StockMovementWithDetails } from '../dal/stock-movements.queries'
import { format } from 'date-fns'

type MovementListProps = {
  movements: StockMovementWithDetails[]
}

const MOVEMENT_TYPE_LABELS = {
  in: 'Stock In',
  out: 'Stock Out',
  adjustment: 'Adjustment',
  transfer: 'Transfer',
  return: 'Return',
  damage: 'Damage',
  theft: 'Theft',
  other: 'Other',
}

const MOVEMENT_TYPE_COLORS = {
  in: 'default',
  out: 'secondary',
  adjustment: 'outline',
  transfer: 'default',
  return: 'default',
  damage: 'destructive',
  theft: 'destructive',
  other: 'outline',
} as const

export function MovementList({ movements }: MovementListProps) {
  if (movements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No stock movements found</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date/Time</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Locations</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead>Performed By</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((movement) => (
          <TableRow key={movement.id}>
            <TableCell>
              <div className="text-sm">
                {format(new Date(movement.created_at), 'MMM dd, yyyy')}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(movement.created_at), 'HH:mm')}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{movement.product?.name || 'Unknown'}</div>
              {movement.product?.sku && (
                <div className="text-xs text-muted-foreground">
                  SKU: {movement.product.sku}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={MOVEMENT_TYPE_COLORS[movement.movement_type as keyof typeof MOVEMENT_TYPE_COLORS]}>
                {MOVEMENT_TYPE_LABELS[movement.movement_type as keyof typeof MOVEMENT_TYPE_LABELS]}
              </Badge>
            </TableCell>
            <TableCell>
              {movement.movement_type === 'transfer' ? (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">
                    {movement.from_location?.name || 'N/A'}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-muted-foreground">
                    {movement.to_location?.name || 'N/A'}
                  </span>
                </div>
              ) : movement.movement_type === 'in' ? (
                <div className="text-sm text-muted-foreground">
                  To: {movement.to_location?.name || 'N/A'}
                </div>
              ) : movement.movement_type === 'out' ? (
                <div className="text-sm text-muted-foreground">
                  From: {movement.from_location?.name || 'N/A'}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <span className={
                movement.quantity > 0
                  ? 'text-green-600 font-medium'
                  : movement.quantity < 0
                  ? 'text-red-600 font-medium'
                  : 'font-medium'
              }>
                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
              </span>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {movement.performed_by?.full_name || 'Unknown'}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                {movement.notes || '-'}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
