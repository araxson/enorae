'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Muted, P } from '@/components/ui/typography'
import type { DailyMetricsDashboardProps } from '../types'
import { formatCurrency } from '../utils/value-formatters'

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
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div>
                  <P className="font-medium">
                    {metric.metric_at &&
                      new Date(metric.metric_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                  </P>
                  <Muted className="text-xs">{metric.total_appointments || 0} appointments</Muted>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <P className="font-medium">{formatCurrency(metric.total_revenue || 0)}</P>
                  <Muted className="text-xs">{metric.completed_appointments || 0} completed</Muted>
                </div>
                <div className="text-right min-w-16">
                  <Badge variant="outline">{(metric.utilization_rate || 0).toFixed(1)}%</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
