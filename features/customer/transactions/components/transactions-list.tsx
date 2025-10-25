'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/features/shared/ui-components'
import { Receipt } from 'lucide-react'
import { TransactionCard } from './transaction-card'
import type { CustomerTransactionWithDetails } from '@/features/customer/transactions/api/queries'

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
    <div className="flex flex-col gap-4">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction['id']} transaction={transaction} />
      ))}
    </div>
  )
}
