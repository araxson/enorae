'use client'

import { DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ManualTransactionWithDetails } from '../api/queries'
import { format } from 'date-fns'

type TransactionsListProps = {
  transactions: ManualTransactionWithDetails[]
}

const TRANSACTION_TYPE_LABELS = {
  payment: 'Payment',
  refund: 'Refund',
  adjustment: 'Adjustment',
  fee: 'Fee',
  other: 'Other',
}

const TRANSACTION_TYPE_COLORS = {
  payment: 'default',
  refund: 'destructive',
  adjustment: 'secondary',
  fee: 'secondary',
  other: 'outline',
} as const

export function TransactionsList({ transactions }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No manual transactions found</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Staff</TableHead>
          <TableHead>Customer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              <div className="text-sm">
                {transaction.transaction_at
                  ? format(new Date(transaction.transaction_at), 'MMM dd, yyyy')
                  : 'N/A'}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={TRANSACTION_TYPE_COLORS[transaction.transaction_type as keyof typeof TRANSACTION_TYPE_COLORS]}>
                {TRANSACTION_TYPE_LABELS[transaction.transaction_type as keyof typeof TRANSACTION_TYPE_LABELS]}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="text-sm capitalize">
                {transaction.payment_method || '-'}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {transaction.created_by?.full_name || 'Unknown'}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">
                {transaction.staff?.full_name || '-'}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">
                {transaction.customer?.full_name || '-'}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
