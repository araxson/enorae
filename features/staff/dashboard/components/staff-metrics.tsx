import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface StaffMetricsProps {
  metrics: {
    todayAppointments: number
    weekAppointments: number
    monthCompleted: number
  }
}

export function StaffMetrics({ metrics }: StaffMetricsProps) {
  const weekProgress = metrics.weekAppointments > 0 ? (metrics.todayAppointments / metrics.weekAppointments) * 100 : 0
  const performance = metrics.monthCompleted > 30 ? 'Excellent' : metrics.monthCompleted > 15 ? 'Good' : 'Getting Started'
  const performanceVariant = metrics.monthCompleted > 30 ? 'default' : metrics.monthCompleted > 15 ? 'secondary' : 'outline'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Performance</h3>
        <Badge variant={performanceVariant}>
          <TrendingUp className="mr-1 h-3 w-3" />
          {performance}
        </Badge>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="rounded-xl border-l-4 border-l-warning">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Today</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.todayAppointments}</div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled for today</p>
              {metrics.todayAppointments > 0 && (
                <div className="mt-2">
                  <Progress value={weekProgress} className="h-1.5 [&>div]:bg-accent" />
                  <p className="text-xs text-muted-foreground mt-1">{Math.round(weekProgress)}% of weekly</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="rounded-xl border-l-4 border-l-info">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>This Week</CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.weekAppointments}</div>
              <p className="text-xs text-muted-foreground mt-1">Total appointments</p>
              {metrics.weekAppointments > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-6 flex-1 rounded ${
                          i < Math.ceil(metrics.weekAppointments / 7)
                            ? 'bg-secondary'
                            : 'bg-secondary/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="rounded-xl border-l-4 border-l-success">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.monthCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
              {metrics.monthCompleted > 0 && (
                <div className="mt-2">
                  <Progress
                    value={Math.min((metrics.monthCompleted / 50) * 100, 100)}
                    className="h-1.5 [&>div]:bg-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Goal: 50 appointments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
