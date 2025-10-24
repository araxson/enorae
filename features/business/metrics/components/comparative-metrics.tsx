'use client'

import { ArrowDownRight, ArrowUpRight, Equal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { MetricsComparison } from '../api/analytics'

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
    return { icon: <ArrowUpRight className="h-4 w-4 text-primary" />, tone: 'text-primary' }
  }
  if (change < -1) {
    return { icon: <ArrowDownRight className="h-4 w-4 text-destructive" />, tone: 'text-destructive' }
  }
  return { icon: <Equal className="h-4 w-4 text-muted-foreground" />, tone: 'text-muted-foreground' }
}

export function ComparativeMetrics({ comparison, periodLabel = 'Last 7 days' }: ComparativeMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Period Comparison</CardTitle>
        <CardDescription>{periodLabel} vs prior period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(metricCopy) as MetricKey[]).map((key) => {
            const meta = metricCopy[key]
            const details = comparison[key]
            const indicator = changeIndicator(details.change)

            return (
              <Card key={key} className="border-dashed">
                <CardHeader className="pb-2">
                  <CardDescription>{meta.label}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div>
                    <div className="text-2xl font-semibold">
                      {formatValue(details.current, meta.unit)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Prev: {formatValue(details.previous, meta.unit)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {indicator.icon}
                    <span className={`text-sm font-medium ${indicator.tone}`}>
                      {details.change > 0 ? '+' : ''}
                      {details.change.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
