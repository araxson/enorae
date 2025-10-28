import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DollarSign, TrendingDown, TrendingUp, Users } from 'lucide-react'
import type { InsightsSummary } from './types'
import { formatCurrency, formatPercentage } from './utils'

interface SummaryCardsProps {
  summary: InsightsSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const metricValueClass = 'text-3xl font-semibold tracking-tight'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Customers</CardTitle>
          <CardDescription>Reach of your active customer base.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between">
            <p className={metricValueClass}>{summary.total_customers}</p>
            <Users className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.active_customers} active
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Grow by converting recent leads into first appointments.</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avg Lifetime Value</CardTitle>
          <CardDescription>Revenue generated per guest over their relationship.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between">
            <p className={metricValueClass}>{formatCurrency(summary.avg_lifetime_value)}</p>
            <DollarSign className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.avg_visits_per_customer.toFixed(1)} avg visits
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Increase with membership bundles and targeted upsells.</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retention Rate</CardTitle>
          <CardDescription>Percent of customers returning for repeat visits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between">
            <p className={metricValueClass}>{formatPercentage(summary.retention_rate)}</p>
            <TrendingUp className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="text-xs text-muted-foreground">Customer retention</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Keep momentum with loyalty rewards and targeted outreach.</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Churn Rate</CardTitle>
          <CardDescription>Guests not returning within the expected window.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between">
            <p className={metricValueClass}>{formatPercentage(summary.churn_rate)}</p>
            <TrendingDown className="size-4 text-destructive" aria-hidden="true" />
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.segmentation.churned} churned customers
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Trigger win-back campaigns for churned guests to restore revenue.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
