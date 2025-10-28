'use client'

import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { InsightsSummary } from '@/features/business/insights/api/queries'

interface CustomerInsightsSummaryCardsProps {
  summary: InsightsSummary
  formatCurrency: (amount: number) => string
  formatPercentage: (value: number) => string
}

export function CustomerInsightsSummaryCards({
  summary,
  formatCurrency,
  formatPercentage,
}: CustomerInsightsSummaryCardsProps) {
  const metricValueClass = 'text-3xl font-semibold tracking-tight'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Customers</CardTitle>
          <CardDescription>{summary.active_customers} active this month</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className={metricValueClass}>{summary.total_customers}</p>
          <Users className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avg Lifetime Value</CardTitle>
          <CardDescription>
            {summary.avg_visits_per_customer.toFixed(1)} visits per customer
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className={metricValueClass}>{formatCurrency(summary.avg_lifetime_value)}</p>
          <DollarSign className="size-4 text-primary" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retention Rate</CardTitle>
          <CardDescription>Returning within 90 days</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className={metricValueClass}>{formatPercentage(summary.retention_rate)}</p>
          <TrendingUp className="size-4 text-primary" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Churn Rate</CardTitle>
          <CardDescription>{summary.segmentation.churned} churned customers</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className={metricValueClass}>{formatPercentage(summary.churn_rate)}</p>
          <TrendingDown className="size-4 text-destructive" aria-hidden="true" />
        </CardContent>
      </Card>
    </div>
  )
}
