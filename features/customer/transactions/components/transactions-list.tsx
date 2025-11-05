'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CustomerTransactionWithDetails } from '@/features/customer/transactions/api/queries'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { TransactionsTable } from './transactions-table'

interface TransactionsListProps {
  transactions: CustomerTransactionWithDetails[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Receipt className="size-5" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No transactions yet</EmptyTitle>
              <EmptyDescription>
                Your completed appointments will appear here once you make a booking.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/customer/salons">Book an appointment</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const totalAmount = transactions.reduce((acc, transaction) => {
    const amount = typeof transaction.amount === 'number' ? transaction.amount : Number(transaction.amount ?? 0)
    return acc + amount
  }, 0)

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="space-y-1">
          <CardTitle>Recent transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            {transactions.length}{' '}
            {transactions.length === 1 ? 'transaction recorded' : 'transactions recorded'}
          </p>
        </div>
        <ItemGroup className="gap-2">
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle>Total spend</ItemTitle>
              <ItemDescription>${totalAmount.toFixed(2)}</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle>Average amount</ItemTitle>
              <ItemDescription>
                ${transactions.length > 0 ? (totalAmount / transactions.length).toFixed(2) : '0.00'}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <TransactionsTable transactions={transactions} />
      </CardContent>
    </Card>
  )
}
