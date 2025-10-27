import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { RevenueOverview } from './admin-overview-types'
import { formatCurrency, safeFormatDate } from './admin-overview-utils'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type RevenueTabProps = {
  revenue: RevenueOverview[]
  windowSize: number
}

export function AdminOverviewRevenueTab({ revenue, windowSize }: RevenueTabProps) {
  if (revenue.length === 0) {
    return (
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Revenue trends</CardTitle>
                <CardDescription>
                  Platform-wide revenue analytics across the most recent periods.
                </CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No revenue data available</EmptyTitle>
              <EmptyDescription>Revenue trends display automatically once salons begin transacting.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>Connect payment providers or import sales to unlock these insights.</EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const rows = revenue.slice(0, 20)

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Revenue trends</CardTitle>
              <CardDescription>
                Platform-wide revenue analytics across the most recent periods.
              </CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup className="flex-wrap items-center gap-2">
          <Item variant="muted">
            <ItemContent>
              <Badge variant="outline">{windowSize || '0'} day window</Badge>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground">
                    Track revenue momentum and appointment conversion.
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs text-muted-foreground">
                  Compare revenue and appointment totals to quickly detect drops in conversion or spikes in demand.
                </TooltipContent>
              </Tooltip>
            </ItemContent>
          </Item>
        </ItemGroup>

        <ScrollArea className="h-80 pr-4">
          <ItemGroup className="space-y-3">
            {rows.map((item, index) => (
              <Item key={`${item['created_at']}-${item['total_revenue']}-${index}`} variant="outline" className="flex-col gap-3">
                <ItemContent>
                  <ItemTitle>{safeFormatDate(item['created_at'] || item['date'], 'MMM d, yyyy')}</ItemTitle>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span className="font-semibold">{formatCurrency(item['total_revenue'])}</span>
                    <span className="text-muted-foreground">
                      {(item['total_appointments'] ?? 0).toLocaleString()} appointments
                    </span>
                  </div>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
