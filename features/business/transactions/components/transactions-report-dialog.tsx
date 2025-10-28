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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { ManualTransactionWithDetails } from '@/features/business/transactions/api/queries'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

interface TransactionsReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactions: ManualTransactionWithDetails[]
}

const formatLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

export function TransactionsReportDialog({
  open,
  onOpenChange,
  transactions,
}: TransactionsReportDialogProps) {
  const report = useMemo(() => {
    const byType = transactions.reduce(
      (acc, t) => {
        const type = t['transaction_type'] || 'unknown'
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const byPaymentMethod = transactions.reduce(
      (acc, t) => {
        const method = t['payment_method'] || 'unknown'
        acc[method] = (acc[method] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const byStaff = transactions.reduce(
      (acc, t) => {
        const staffName = t.staff?.['full_name'] || 'Unassigned'
        acc[staffName] = (acc[staffName] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const dateRange = transactions.length > 0
      ? {
          earliest: transactions
            .filter((t) => t['transaction_at'])
            .reduce(
              (min, t) => {
                const date = new Date(t['transaction_at']!)
                return date < min ? date : min
              },
              new Date(transactions[0]?.['transaction_at'] || new Date())
            ),
          latest: transactions
            .filter((t) => t['transaction_at'])
            .reduce(
              (max, t) => {
                const date = new Date(t['transaction_at']!)
                return date > max ? date : max
              },
              new Date(transactions[0]?.['transaction_at'] || new Date())
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
            <Item variant="outline" className="flex-col gap-3">
              <ItemHeader>
                <ItemTitle>Report Period</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <div className="flex flex-col gap-2">
                  <p>
                    {format(report.dateRange.earliest, 'MMM dd, yyyy')}
                    {' '}
                    -
                    {' '}
                    {format(report.dateRange.latest, 'MMM dd, yyyy')}
                  </p>
                  <ItemDescription>
                    Total Transactions:
                    {' '}
                    {report.total}
                  </ItemDescription>
                </div>
              </ItemContent>
            </Item>
          )}

          <Item variant="outline" className="flex-col gap-4">
            <ItemHeader>
              <ItemTitle>By Transaction Type</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <Separator />
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                {Object.entries(report.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <Badge variant="secondary">{formatLabel(type)}</Badge>
                    <p className="text-muted-foreground">{count}</p>
                  </div>
                ))}
              </div>
            </ItemContent>
          </Item>

          <Item variant="outline" className="flex-col gap-4">
            <ItemHeader>
              <ItemTitle>By Payment Method</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <Separator />
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                {Object.entries(report.byPaymentMethod).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <p className="capitalize">{method}</p>
                    <p className="text-muted-foreground">{count}</p>
                  </div>
                ))}
              </div>
            </ItemContent>
          </Item>

          <Item variant="outline" className="flex-col gap-4">
            <ItemHeader>
              <ItemTitle>By Staff Member</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <Separator />
              <div className="flex flex-col gap-3">
                {Object.entries(report.byStaff)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([staff, count]) => (
                    <div key={staff} className="flex items-center justify-between">
                      <p>{staff}</p>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
              </div>
            </ItemContent>
          </Item>
        </div>
      </DialogContent>
    </Dialog>
  )
}
