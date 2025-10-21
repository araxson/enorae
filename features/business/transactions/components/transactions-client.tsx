'use client'

import { useState } from 'react'
import { Plus, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransactionsList } from './transactions-list'
import { CreateTransactionDialog } from './create-transaction-dialog'
import { TransactionsReportDialog } from './transactions-report-dialog'
import type { ManualTransactionWithDetails } from '../api/queries'
import { format } from 'date-fns'

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
      t.transaction_at ? format(new Date(t.transaction_at), 'yyyy-MM-dd') : '',
      t.transaction_type || '',
      t.payment_method || '',
      t.staff?.full_name || '',
      t.customer?.full_name || '',
      t.created_by?.full_name || '',
      t.created_at ? format(new Date(t.created_at), 'yyyy-MM-dd HH:mm:ss') : '',
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
      <div className="flex gap-4 items-start justify-between">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold">Manual Transactions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track manual financial transactions and adjustments
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsReportDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={handleExportCSV} disabled={transactions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Transaction
          </Button>
        </div>
      </div>

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
