import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import type { InsightsSummary } from './types'
import { formatCurrency, formatPercentage } from './utils'

interface SummaryCardsProps {
  summary: InsightsSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="space-y-1 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription>Reach of your active customer base.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total_customers}</div>
          <p className="text-xs text-muted-foreground">
            {summary.active_customers} active
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Grow by converting recent leads into first appointments.
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="space-y-1 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Avg Lifetime Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <CardDescription>Revenue generated per guest over their relationship.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.avg_lifetime_value)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.avg_visits_per_customer.toFixed(1)} avg visits
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Increase with membership bundles and targeted upsells.
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="space-y-1 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <CardDescription>Percent of customers returning for repeat visits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(summary.retention_rate)}
          </div>
          <p className="text-xs text-muted-foreground">
            Customer retention
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Keep momentum with loyalty rewards and targeted outreach.
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="space-y-1 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </div>
          <CardDescription>Guests not returning within the expected window.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatPercentage(summary.churn_rate)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.segmentation.churned} churned customers
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Trigger win-back campaigns for churned guests to restore revenue.
        </CardFooter>
      </Card>
    </div>
  )
}
