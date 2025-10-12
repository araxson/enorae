'use client'

import Link from 'next/link'
import { Stack } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { Receipt } from 'lucide-react'
import { TransactionCard } from './transaction-card'
import type { CustomerTransactionWithDetails } from '../api/queries'

interface TransactionsListProps {
  transactions: CustomerTransactionWithDetails[]
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
    <Stack gap="md">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </Stack>
  )
}
