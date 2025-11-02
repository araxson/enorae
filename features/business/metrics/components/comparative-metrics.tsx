'use client'

import { ArrowDownRight, ArrowUpRight, Equal } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { MetricsComparison } from '@/features/business/metrics/utils/metrics'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type MetricKey = keyof MetricsComparison

const metricCopy: Record<MetricKey, { label: string; unit?: 'currency' | 'number' | 'percentage' }> = {
  revenue: { label: 'Revenue', unit: 'currency' },
  appointments: { label: 'Appointments', unit: 'number' },
  newCustomers: { label: 'New Customers', unit: 'number' },
  retentionRate: { label: 'Retention Rate', unit: 'percentage' },
}

type ComparativeMetricsProps = {
  comparison: MetricsComparison
  periodLabel?: string
}

function formatValue(value: number, unit: 'currency' | 'number' | 'percentage' = 'number') {
  if (unit === 'currency') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }
  if (unit === 'percentage') {
    return `${value.toFixed(1)}%`
  }
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

function changeIndicator(change: number) {
  if (change > 1) {
    return { icon: <ArrowUpRight className="size-4 text-primary" />, tone: 'text-primary' }
  }
  if (change < -1) {
    return { icon: <ArrowDownRight className="size-4 text-destructive" />, tone: 'text-destructive' }
  }
  return { icon: <Equal className="size-4 text-muted-foreground" />, tone: 'text-muted-foreground' }
}

export function ComparativeMetrics({ comparison, periodLabel = 'Last 7 days' }: ComparativeMetricsProps) {
  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader>
        <ItemTitle>Period Comparison</ItemTitle>
        <ItemDescription>{periodLabel} vs prior period</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Current</TableHead>
              <TableHead className="text-right">Previous</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(Object.keys(metricCopy) as MetricKey[]).map((key) => {
              const meta = metricCopy[key]
              const details = comparison[key]
              const indicator = changeIndicator(details.change)

              return (
                <TableRow key={key}>
                  <TableCell className="font-medium">{meta.label}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatValue(details.current, meta.unit)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatValue(details.previous, meta.unit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {indicator.icon}
                      <Badge variant={details.change > 1 ? 'default' : details.change < -1 ? 'destructive' : 'secondary'}>
                        {details.change > 0 ? '+' : ''}
                        {details.change.toFixed(1)}%
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ItemContent>
    </Item>
  )
}
