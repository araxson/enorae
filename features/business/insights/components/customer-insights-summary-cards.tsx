'use client'

import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { InsightsSummary } from '@/features/business/insights/types'
import { useCurrencyFormatter } from '@/features/business/insights/hooks/use-currency-formatter'

interface CustomerInsightsSummaryCardsProps {
  summary: InsightsSummary
}

export function CustomerInsightsSummaryCards({ summary }: CustomerInsightsSummaryCardsProps) {
  const { formatCurrency, formatPercentage } = useCurrencyFormatter()
  const metricValueClass = 'text-2xl font-semibold tracking-tight'

  return (
    <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Total Customers</ItemTitle>
          <ItemActions>
            <Users className="size-4 text-muted-foreground" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={metricValueClass}>{summary.total_customers}</p>
          <ItemDescription>{summary.active_customers} active this month</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Avg Lifetime Value</ItemTitle>
          <ItemActions>
            <DollarSign className="size-4 text-primary" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={metricValueClass}>{formatCurrency(summary.avg_lifetime_value)}</p>
          <ItemDescription>
            {summary.avg_visits_per_customer.toFixed(1)} visits per customer
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Retention Rate</ItemTitle>
          <ItemActions>
            <TrendingUp className="size-4 text-primary" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={metricValueClass}>{formatPercentage(summary.retention_rate)}</p>
          <ItemDescription>Returning within 90 days</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Churn Rate</ItemTitle>
          <ItemActions>
            <TrendingDown className="size-4 text-destructive" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={metricValueClass}>{formatPercentage(summary.churn_rate)}</p>
          <ItemDescription>{summary.segmentation.churned} churned customers</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
