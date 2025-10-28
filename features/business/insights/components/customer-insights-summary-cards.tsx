'use client'

import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <ItemGroup className="flex w-full items-center justify-between">
            <Item>
              <ItemContent>
                <ItemTitle>Total Customers</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <CardTitle>{summary.total_customers}</CardTitle>
          <div className="text-xs text-muted-foreground">{summary.active_customers} active</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <ItemGroup className="flex w-full items-center justify-between">
            <Item>
              <ItemContent>
                <ItemTitle>Avg Lifetime Value</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <CardTitle>{formatCurrency(summary.avg_lifetime_value)}</CardTitle>
          <div className="text-xs text-muted-foreground">
            {summary.avg_visits_per_customer.toFixed(1)} avg visits
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <ItemGroup className="flex w-full items-center justify-between">
            <Item>
              <ItemContent>
                <ItemTitle>Retention Rate</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <CardTitle>{formatPercentage(summary.retention_rate)}</CardTitle>
          <div className="text-xs text-muted-foreground">Customer retention</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <ItemGroup className="flex w-full items-center justify-between">
            <Item>
              <ItemContent>
                <ItemTitle>Churn Rate</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <TrendingDown className="h-4 w-4 text-destructive" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <CardTitle>{formatPercentage(summary.churn_rate)}</CardTitle>
          <div className="text-xs text-muted-foreground">
            {summary.segmentation.churned} churned customers
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
