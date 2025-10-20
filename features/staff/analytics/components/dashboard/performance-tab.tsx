import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StaffPerformanceMetrics } from '../../api/queries'
import { formatPercentage } from './utils'

interface PerformanceTabProps {
  metrics: StaffPerformanceMetrics
}

export function PerformanceTab({ metrics }: PerformanceTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Statistics</CardTitle>
          <CardDescription>Your appointment performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Appointments</span>
            <Badge variant="outline">{metrics.total_appointments}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completed</span>
            <Badge variant="default">{metrics.completed_appointments}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cancelled</span>
            <Badge variant="destructive">{metrics.cancelled_appointments}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">No Shows</span>
            <Badge variant="secondary">{metrics.no_show_appointments}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Rates</CardTitle>
          <CardDescription>Completion and cancellation metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-sm font-bold text-primary">
                {formatPercentage(metrics.completion_rate)}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${metrics.completion_rate}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Cancellation Rate</span>
              <span className="text-sm font-bold text-destructive">
                {formatPercentage(metrics.cancellation_rate)}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-destructive"
                style={{ width: `${metrics.cancellation_rate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
