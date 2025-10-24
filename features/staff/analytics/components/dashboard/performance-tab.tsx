import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StaffPerformanceMetrics } from '@/features/staff/analytics/api/queries'
import { formatPercentage } from './utils'
import { Progress } from '@/components/ui/progress'

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
        <CardContent>
          <div className="space-y-3">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Rates</CardTitle>
          <CardDescription>Completion and cancellation metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-semibold text-primary">
                  {formatPercentage(metrics.completion_rate)}
                </span>
              </div>
              <Progress value={metrics.completion_rate} className="h-2" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Cancellation Rate</span>
                <span className="text-sm font-semibold text-destructive">
                  {formatPercentage(metrics.cancellation_rate)}
                </span>
              </div>
              <Progress value={metrics.cancellation_rate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
