'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box } from '@/components/layout'
import { H2, Muted } from '@/components/ui/typography'
import { TransactionsList } from './transactions-list'
import { CreateTransactionDialog } from './create-transaction-dialog'
import type { ManualTransactionWithDetails } from '../api/queries'

interface TransactionsClientProps {
  transactions: ManualTransactionWithDetails[]
  staffOptions?: Array<{ id: string; full_name: string | null }>
  customerOptions?: Array<{ id: string; full_name: string | null; email?: string | null }>
}

export function TransactionsClient({
  transactions,
  staffOptions = [],
  customerOptions = [],
}: TransactionsClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <Stack gap="xl">
      <Flex justify="between" align="start">
        <Box>
          <H2>Manual Transactions</H2>
          <Muted className="mt-1">
            Track manual financial transactions and adjustments
          </Muted>
        </Box>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Record Transaction
        </Button>
      </Flex>

      <TransactionsList transactions={transactions} />

      <CreateTransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        staffOptions={staffOptions}
        customerOptions={customerOptions}
      />
    </Stack>
  )
}
