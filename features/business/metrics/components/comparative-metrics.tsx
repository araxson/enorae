'use client'

import { ArrowDownRight, ArrowUpRight, Equal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid } from '@/components/layout'
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
    return { icon: <ArrowUpRight className="h-4 w-4 text-emerald-500" />, tone: 'text-emerald-600' }
  }
  if (change < -1) {
    return { icon: <ArrowDownRight className="h-4 w-4 text-rose-500" />, tone: 'text-rose-600' }
  }
  return { icon: <Equal className="h-4 w-4 text-muted-foreground" />, tone: 'text-muted-foreground' }
}

export function ComparativeMetrics({ comparison, periodLabel = 'Last 7 days' }: ComparativeMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Period Comparison</CardTitle>
        <p className="text-sm text-muted-foreground text-sm">{periodLabel} vs prior period</p>
      </CardHeader>
      <CardContent>
        <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="lg">
          {(Object.keys(metricCopy) as MetricKey[]).map((key) => {
            const meta = metricCopy[key]
            const details = comparison[key]
            const indicator = changeIndicator(details.change)

            return (
              <Card key={key} className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <small className="text-sm font-medium leading-none text-muted-foreground">{meta.label}</small>
                  <div>
                    <p className="text-2xl font-semibold">
                      {formatValue(details.current, meta.unit)}
                    </p>
                    <p className="text-sm text-muted-foreground text-xs">
                      Prev: {formatValue(details.previous, meta.unit)}
                    </p>
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
        </Grid>
      </CardContent>
    </Card>
  )
}
