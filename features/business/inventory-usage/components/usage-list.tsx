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
import type { ProductUsageWithDetails } from '../api/queries'
import { format } from 'date-fns'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type UsageListProps = {
  usage: ProductUsageWithDetails[]
}

export function UsageList({ usage }: UsageListProps) {
  if (usage.length === 0) {
    return (
      <Alert>
        <Package className="h-4 w-4" />
        <AlertTitle>No product usage records</AlertTitle>
        <AlertDescription>New usage entries will appear once recorded.</AlertDescription>
      </Alert>
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
                {record.created_at
                  ? format(new Date(record.created_at), 'MMM dd, yyyy')
                  : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                {record.created_at
                  ? format(new Date(record.created_at), 'HH:mm')
                  : ''}
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
              {formatCurrency((record.cost_at_time || 0) * (record.quantity_used || 0))}
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {record.staff?.full_name || 'Unknown'}
              </div>
            </TableCell>
            <TableCell>
              {record.appointment?.start_time ? (
                <div className="text-sm text-muted-foreground">
                  {format(new Date(record.appointment.start_time), 'MMM dd, HH:mm')}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="max-w-xs truncate text-sm text-muted-foreground">
                {record.notes || '-'}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
