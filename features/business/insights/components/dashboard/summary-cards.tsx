import { DollarSign, TrendingDown, TrendingUp, Users } from 'lucide-react'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import type { InsightsSummary } from '../../api/types'
import { formatCurrency, formatPercentage } from './utils'

interface SummaryCardsProps {
  summary: InsightsSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
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
          <ItemDescription>Reach of your active customer base.</ItemDescription>
          <p className={metricValueClass}>{summary.total_customers}</p>
          <p className="text-xs text-muted-foreground">
            {summary.active_customers} active
          </p>
        </ItemContent>
        <ItemFooter>
          <p className="text-xs text-muted-foreground">Grow by converting recent leads into first appointments.</p>
        </ItemFooter>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Avg Lifetime Value</ItemTitle>
          <ItemActions>
            <DollarSign className="size-4 text-primary" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>Revenue generated per guest over their relationship.</ItemDescription>
          <p className={metricValueClass}>{formatCurrency(summary.avg_lifetime_value)}</p>
          <p className="text-xs text-muted-foreground">
            {summary.avg_visits_per_customer.toFixed(1)} avg visits
          </p>
        </ItemContent>
        <ItemFooter>
          <p className="text-xs text-muted-foreground">Increase with membership bundles and targeted upsells.</p>
        </ItemFooter>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Retention Rate</ItemTitle>
          <ItemActions>
            <TrendingUp className="size-4 text-primary" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>Percent of customers returning for repeat visits.</ItemDescription>
          <p className={metricValueClass}>{formatPercentage(summary.retention_rate)}</p>
          <p className="text-xs text-muted-foreground">Customer retention</p>
        </ItemContent>
        <ItemFooter>
          <p className="text-xs text-muted-foreground">Keep momentum with loyalty rewards and targeted outreach.</p>
        </ItemFooter>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Churn Rate</ItemTitle>
          <ItemActions>
            <TrendingDown className="size-4 text-destructive" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>Guests not returning within the expected window.</ItemDescription>
          <p className={metricValueClass}>{formatPercentage(summary.churn_rate)}</p>
          <p className="text-xs text-muted-foreground">
            {summary.segmentation.churned} churned customers
          </p>
        </ItemContent>
        <ItemFooter>
          <p className="text-xs text-muted-foreground">Trigger win-back campaigns for churned guests to restore revenue.</p>
        </ItemFooter>
      </Item>
    </ItemGroup>
  )
}
