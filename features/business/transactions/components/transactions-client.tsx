'use client'

import { useState } from 'react'
import { Download, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { ManualTransactionWithDetails } from '@/features/business/transactions/api/queries'
import { format } from 'date-fns'
import { CreateTransactionDialog } from './create-transaction-dialog'
import { TransactionsList } from './transactions-list'
import { TransactionsReportDialog } from './transactions-report-dialog'

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
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

  const handleExportCSV = () => {
    if (transactions.length === 0) return

    const headers = ['Date', 'Type', 'Payment Method', 'Staff', 'Customer', 'Created By', 'Created At']
    const rows = transactions.map((t) => [
      t['transaction_at'] ? format(new Date(t['transaction_at']), 'yyyy-MM-dd') : '',
      t['transaction_type'] || '',
      t['payment_method'] || '',
      t.staff?.['full_name'] || '',
      t.customer?.['full_name'] || '',
      t.created_by?.['full_name'] || '',
      t['created_at'] ? format(new Date(t['created_at']), 'yyyy-MM-dd HH:mm:ss') : '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-8">
      <ItemGroup className="items-start justify-between gap-4">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Manual Transactions</ItemTitle>
            <ItemDescription>
              Track manual financial transactions and adjustments
            </ItemDescription>
          </ItemContent>
        </Item>
        <ItemActions className="flex-none">
          <ButtonGroup aria-label="Transaction actions">
            <Button variant="outline" onClick={() => setIsReportDialogOpen(true)}>
              <FileText className="mr-2 size-4" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={handleExportCSV} disabled={transactions.length === 0}>
              <Download className="mr-2 size-4" />
              Export CSV
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 size-4" />
              Record Transaction
            </Button>
          </ButtonGroup>
        </ItemActions>
      </ItemGroup>

      <TransactionsList transactions={transactions} />

      <CreateTransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        staffOptions={staffOptions}
        customerOptions={customerOptions}
      />

      <TransactionsReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        transactions={transactions}
      />
    </div>
  )
}
