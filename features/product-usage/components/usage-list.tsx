'use client'

import { Package } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ProductUsageWithDetails } from '../dal/product-usage.queries'
import { format } from 'date-fns'

type UsageListProps = {
  usage: ProductUsageWithDetails[]
}

export function UsageList({ usage }: UsageListProps) {
  if (usage.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No product usage records found</p>
      </div>
    )
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date/Time</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Quantity Used</TableHead>
          <TableHead className="text-right">Unit Cost</TableHead>
          <TableHead className="text-right">Total Cost</TableHead>
          <TableHead>Used By</TableHead>
          <TableHead>Appointment</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usage.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              <div className="text-sm">
                {format(new Date(record.created_at), 'MMM dd, yyyy')}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(record.created_at), 'HH:mm')}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{record.product?.name || 'Unknown'}</div>
              {record.product?.sku && (
                <div className="text-xs text-muted-foreground">
                  SKU: {record.product.sku}
                </div>
              )}
            </TableCell>
            <TableCell className="text-right font-medium">
              {record.quantity_used}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(record.cost_at_time)}
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency((record.cost_at_time || 0) * record.quantity_used)}
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {record.staff?.full_name || 'Unknown'}
              </div>
            </TableCell>
            <TableCell>
              {record.appointment ? (
                <div className="text-sm text-muted-foreground">
                  {format(new Date(record.appointment.scheduled_at), 'MMM dd, HH:mm')}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                {record.notes || '-'}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
