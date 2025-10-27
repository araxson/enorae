'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/features/shared/ui-components'
import { Receipt } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import type { CustomerTransactionWithDetails } from '@/features/customer/transactions/api/queries'

interface TransactionsListProps {
  transactions: CustomerTransactionWithDetails[]
}

const getTypeColor = (type: string | null): "default" | "destructive" | "secondary" | "outline" => {
  if (!type) return 'outline'
  switch (type.toLowerCase()) {
    case 'sale':
      return 'default'
    case 'refund':
      return 'destructive'
    case 'adjustment':
      return 'secondary'
    default:
      return 'outline'
  }
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        description="Your completed appointments will appear here once you make a booking."
        action={
          <Button asChild>
            <Link href="/customer/salons">Book an appointment</Link>
          </Button>
        }
      />
    )
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Salon</TableHead>
              <TableHead>Staff Member</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
            const transactionDate = transaction.transaction_at
              ? new Date(transaction.transaction_at)
              : new Date()

            return (
              <TableRow key={transaction['id']}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{format(transactionDate, 'PPP')}</p>
                    <p className="text-sm text-muted-foreground">{format(transactionDate, 'p')}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.salon?.name || 'Unknown Salon'}
                </TableCell>
                <TableCell>
                  {transaction.staff?.full_name || '-'}
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.payment_method || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={getTypeColor(transaction.transaction_type || null)}>
                    {transaction.transaction_type || 'Unknown'}
                  </Badge>
                </TableCell>
              </TableRow>
            )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
