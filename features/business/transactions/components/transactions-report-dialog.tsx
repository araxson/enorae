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
import { Stack, Grid } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
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

        <Stack gap="lg">
          {report.dateRange && (
            <Card className="p-4">
              <Stack gap="sm">
                <H3 className="text-lg">Report Period</H3>
                <P>
                  {format(report.dateRange.earliest, 'MMM dd, yyyy')} -{' '}
                  {format(report.dateRange.latest, 'MMM dd, yyyy')}
                </P>
                <Muted className="text-sm">
                  Total Transactions: {report.total}
                </Muted>
              </Stack>
            </Card>
          )}

          <Card className="p-4">
            <Stack gap="md">
              <H3 className="text-lg">By Transaction Type</H3>
              <Separator />
              <Grid cols={{ base: 2, md: 3 }} gap="md">
                {Object.entries(report.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {type}
                    </Badge>
                    <Muted>{count}</Muted>
                  </div>
                ))}
              </Grid>
            </Stack>
          </Card>

          <Card className="p-4">
            <Stack gap="md">
              <H3 className="text-lg">By Payment Method</H3>
              <Separator />
              <Grid cols={{ base: 2, md: 3 }} gap="md">
                {Object.entries(report.byPaymentMethod).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <P className="capitalize text-sm">{method}</P>
                    <Muted>{count}</Muted>
                  </div>
                ))}
              </Grid>
            </Stack>
          </Card>

          <Card className="p-4">
            <Stack gap="md">
              <H3 className="text-lg">By Staff Member</H3>
              <Separator />
              <Stack gap="sm">
                {Object.entries(report.byStaff)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([staff, count]) => (
                    <div key={staff} className="flex items-center justify-between">
                      <P className="text-sm">{staff}</P>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
