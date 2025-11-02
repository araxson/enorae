import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { DollarSign } from 'lucide-react'
import type { RevenueOverview } from '../types'
import { formatCurrency, safeFormatDate } from './admin-overview-utils'

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
              <EmptyMedia variant="icon">
                <DollarSign aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No revenue data available</EmptyTitle>
              <EmptyDescription>
                Revenue trends display automatically once salons begin transacting.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              Connect payment providers or import sales to unlock these insights.
            </EmptyContent>
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
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <Badge variant="outline">{windowSize || '0'} day window</Badge>
              </ItemContent>
            </Item>
            <Item variant="muted">
              <ItemContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ItemDescription>
                      Track revenue momentum and appointment conversion.
                    </ItemDescription>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm text-muted-foreground">
                      Compare revenue and appointment totals to quickly detect drops in conversion or spikes in demand.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </ItemContent>
            </Item>
            </ItemGroup>
          </div>

          <ScrollArea className="h-80 pr-4">
            <div className="space-y-3">
              <ItemGroup>
                {rows.map((item, index) => (
                  <Item key={`${item['created_at']}-${item['total_revenue']}-${index}`} variant="outline">
                    <ItemContent>
                      <div className="flex flex-col gap-3">
                        <ItemTitle>
                          {safeFormatDate(item['created_at'] || item['date'], 'MMM d, yyyy')}
                        </ItemTitle>
                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                          <span className="font-semibold">{formatCurrency(item['total_revenue'])}</span>
                          <span className="text-muted-foreground">
                            {(item['total_appointments'] ?? 0).toLocaleString()} appointments
                          </span>
                        </div>
                      </div>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
