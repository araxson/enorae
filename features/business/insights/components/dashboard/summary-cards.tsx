import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { DollarSign, TrendingDown, TrendingUp, Users } from 'lucide-react'
import type { InsightsSummary } from './types'
import { formatCurrency, formatPercentage } from './utils'

interface SummaryCardsProps {
  summary: InsightsSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <div className="space-y-1 pb-2">
            <ItemGroup>
              <Item className="items-center justify-between gap-2">
                <ItemContent>
                  <ItemTitle>Total Customers</ItemTitle>
                </ItemContent>
                <ItemMedia variant="icon">
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </ItemMedia>
              </Item>
              <Item>
                <ItemContent>
                  <ItemDescription>Reach of your active customer base.</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{summary.total_customers}</CardTitle>
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
          <div className="space-y-1 pb-2">
            <ItemGroup>
              <Item className="items-center justify-between gap-2">
                <ItemContent>
                  <ItemTitle>Avg Lifetime Value</ItemTitle>
                </ItemContent>
                <ItemMedia variant="icon">
                  <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
                </ItemMedia>
              </Item>
              <Item>
                <ItemContent>
                  <ItemDescription>Revenue generated per guest over their relationship.</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{formatCurrency(summary.avg_lifetime_value)}</CardTitle>
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
          <div className="space-y-1 pb-2">
            <ItemGroup>
              <Item className="items-center justify-between gap-2">
                <ItemContent>
                  <ItemTitle>Retention Rate</ItemTitle>
                </ItemContent>
                <ItemMedia variant="icon">
                  <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                </ItemMedia>
              </Item>
              <Item>
                <ItemContent>
                  <ItemDescription>Percent of customers returning for repeat visits.</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{formatPercentage(summary.retention_rate)}</CardTitle>
          <p className="text-xs text-muted-foreground">
            Customer retention
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Keep momentum with loyalty rewards and targeted outreach.</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="space-y-1 pb-2">
            <ItemGroup>
              <Item className="items-center justify-between gap-2">
                <ItemContent>
                  <ItemTitle>Churn Rate</ItemTitle>
                </ItemContent>
                <ItemMedia variant="icon">
                  <TrendingDown className="h-4 w-4 text-destructive" aria-hidden="true" />
                </ItemMedia>
              </Item>
              <Item>
                <ItemContent>
                  <ItemDescription>Guests not returning within the expected window.</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{formatPercentage(summary.churn_rate)}</CardTitle>
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
