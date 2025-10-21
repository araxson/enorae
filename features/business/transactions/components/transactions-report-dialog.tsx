'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { ManualTransactionWithDetails } from '../api/queries'

interface TransactionsReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactions: ManualTransactionWithDetails[]
}

export function TransactionsReportDialog({
  open,
  onOpenChange,
  transactions,
}: TransactionsReportDialogProps) {
  const report = useMemo(() => {
    const byType = transactions.reduce(
      (acc, t) => {
        const type = t.transaction_type || 'unknown'
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const byPaymentMethod = transactions.reduce(
      (acc, t) => {
        const method = t.payment_method || 'unknown'
        acc[method] = (acc[method] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const byStaff = transactions.reduce(
      (acc, t) => {
        const staffName = t.staff?.full_name || 'Unassigned'
        acc[staffName] = (acc[staffName] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const dateRange = transactions.length > 0
      ? {
          earliest: transactions
            .filter((t) => t.transaction_at)
            .reduce(
              (min, t) => {
                const date = new Date(t.transaction_at!)
                return date < min ? date : min
              },
              new Date(transactions[0].transaction_at!)
            ),
          latest: transactions
            .filter((t) => t.transaction_at)
            .reduce(
              (max, t) => {
                const date = new Date(t.transaction_at!)
                return date > max ? date : max
              },
              new Date(transactions[0].transaction_at!)
            ),
        }
      : null

    return {
      total: transactions.length,
      byType,
      byPaymentMethod,
      byStaff,
      dateRange,
    }
  }, [transactions])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Report</DialogTitle>
          <DialogDescription>
            Summary of manual transactions and key metrics
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {report.dateRange && (
            <Card className="p-4">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">Report Period</h3>
                <p className="leading-7">
                  {format(report.dateRange.earliest, 'MMM dd, yyyy')} -{' '}
                  {format(report.dateRange.latest, 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground text-sm">
                  Total Transactions: {report.total}
                </p>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">By Transaction Type</h3>
              <Separator />
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                {Object.entries(report.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {type}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">By Payment Method</h3>
              <Separator />
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                {Object.entries(report.byPaymentMethod).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <p className="leading-7 capitalize text-sm">{method}</p>
                    <p className="text-sm text-muted-foreground">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">By Staff Member</h3>
              <Separator />
              <div className="flex flex-col gap-3">
                {Object.entries(report.byStaff)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([staff, count]) => (
                    <div key={staff} className="flex items-center justify-between">
                      <p className="leading-7 text-sm">{staff}</p>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
