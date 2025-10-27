'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { DailyMetricsDashboardProps } from '../types'
import { formatCurrency } from '@/features/business/business-common'

type Props = Pick<DailyMetricsDashboardProps, 'metrics'>

export function DailyBreakdownList({ metrics }: Props) {
  if (metrics.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup className="max-h-96 overflow-y-auto">
          {metrics.map((metric) => (
            <Item key={metric.id} variant="outline" className="flex-col items-start gap-3">
              <ItemHeader>
                <ItemTitle>
                  {metric.metric_at
                    ? new Date(metric.metric_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—'}
                </ItemTitle>
                <ItemActions>
                  <Badge variant="outline">{(metric.utilization_rate || 0).toFixed(1)}%</Badge>
                </ItemActions>
              </ItemHeader>

              <ItemContent>
                <ItemDescription>
                  {metric.total_appointments || 0} appointments
                </ItemDescription>
                <div className="flex w-full items-center justify-between gap-6">
                  <div className="text-right">
                    <p className="font-medium leading-7">
                      {formatCurrency(metric.total_revenue || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.completed_appointments || 0} completed
                    </p>
                  </div>
                </div>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
