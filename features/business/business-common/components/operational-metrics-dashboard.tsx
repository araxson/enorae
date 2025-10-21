'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react'

interface OperationalMetricsDashboardProps {
  metrics: {
    capacityUtilization: number
    averageWaitTime: number
    staffUtilization: number
    appointmentsPerDay: number
    bookingFillRate: number
    peakHours: string[]
  }
}

export function OperationalMetricsDashboard({ metrics }: OperationalMetricsDashboardProps) {
  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'text-primary'
    if (percentage >= 60) return 'text-accent'
    return 'text-destructive'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational Metrics</CardTitle>
        <CardDescription>Real-time operational performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Utilization Metrics */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-3 items-center">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm font-medium">Capacity Utilization</div>
                </div>
                <div className={`text-3xl font-bold ${getUtilizationColor(metrics.capacityUtilization)}`}>
                  {metrics.capacityUtilization}%
                </div>
                <Progress value={metrics.capacityUtilization} className="h-2" />
                <div className="text-xs text-muted-foreground">Overall capacity usage</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-3 items-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm font-medium">Staff Utilization</div>
                </div>
                <div className={`text-3xl font-bold ${getUtilizationColor(metrics.staffUtilization)}`}>
                  {metrics.staffUtilization}%
                </div>
                <Progress value={metrics.staffUtilization} className="h-2" />
                <div className="text-xs text-muted-foreground">Staff productivity</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-3 items-center">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm font-medium">Booking Fill Rate</div>
                </div>
                <div className={`text-3xl font-bold ${getUtilizationColor(metrics.bookingFillRate)}`}>
                  {metrics.bookingFillRate}%
                </div>
                <Progress value={metrics.bookingFillRate} className="h-2" />
                <div className="text-xs text-muted-foreground">Schedule efficiency</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex gap-3 items-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="text-base font-medium">Average Wait Time</div>
                </div>
                <div className="text-2xl font-bold">{metrics.averageWaitTime} min</div>
                <div className="text-xs text-muted-foreground">Per customer</div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex gap-3 items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="text-base font-medium">Appointments/Day</div>
                </div>
                <div className="text-2xl font-bold">{metrics.appointmentsPerDay}</div>
                <div className="text-xs text-muted-foreground">Average daily bookings</div>
              </CardContent>
            </Card>
          </div>

          {/* Peak Hours */}
          {metrics.peakHours.length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-3 items-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <div className="text-base font-medium">Peak Hours</div>
                </div>
                <div className="flex gap-2">
                  {metrics.peakHours.map((hour, index) => (
                    <Badge key={index} variant="secondary">
                      {hour}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Busiest times of day</div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
