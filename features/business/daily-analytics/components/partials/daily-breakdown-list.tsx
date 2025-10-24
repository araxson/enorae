'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DailyMetricsDashboardProps } from '@/features/business/daily-analytics/types'
import { formatCurrency } from '@/features/business/daily-analytics/utils/value-formatters'

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
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <CardHeader className="pb-2">
                <CardTitle>
                  {metric.metric_at &&
                    new Date(metric.metric_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-6 pt-0">
                <p className="text-xs text-muted-foreground">
                  {metric.total_appointments || 0} appointments
                </p>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium leading-7">
                      {formatCurrency(metric.total_revenue || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.completed_appointments || 0} completed
                    </p>
                  </div>
                  <div className="min-w-16 text-right">
                    <Badge variant="outline">{(metric.utilization_rate || 0).toFixed(1)}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
