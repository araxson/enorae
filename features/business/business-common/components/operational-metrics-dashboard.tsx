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
    if (percentage >= 80) return 'text-success'
    if (percentage >= 60) return 'text-warning'
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
            <div className="p-4 rounded-lg border">
              <div className="flex gap-3 items-center mb-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-sm">Capacity Utilization</h3>
              </div>
              <div className={`text-3xl font-bold mb-2 ${getUtilizationColor(metrics.capacityUtilization)}`}>
                {metrics.capacityUtilization}%
              </div>
              <Progress value={metrics.capacityUtilization} className="h-2" />
              <small className="text-sm font-medium leading-none text-muted-foreground mt-2">Overall capacity usage</small>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex gap-3 items-center mb-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-sm">Staff Utilization</h3>
              </div>
              <div className={`text-3xl font-bold mb-2 ${getUtilizationColor(metrics.staffUtilization)}`}>
                {metrics.staffUtilization}%
              </div>
              <Progress value={metrics.staffUtilization} className="h-2" />
              <small className="text-sm font-medium leading-none text-muted-foreground mt-2">Staff productivity</small>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex gap-3 items-center mb-3">
                <Target className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-sm">Booking Fill Rate</h3>
              </div>
              <div className={`text-3xl font-bold mb-2 ${getUtilizationColor(metrics.bookingFillRate)}`}>
                {metrics.bookingFillRate}%
              </div>
              <Progress value={metrics.bookingFillRate} className="h-2" />
              <small className="text-sm font-medium leading-none text-muted-foreground mt-2">Schedule efficiency</small>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex gap-3 items-center mb-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-base">Average Wait Time</h3>
              </div>
              <div className="text-2xl font-bold">{metrics.averageWaitTime} min</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Per customer</small>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex gap-3 items-center mb-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-base">Appointments/Day</h3>
              </div>
              <div className="text-2xl font-bold">{metrics.appointmentsPerDay}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Average daily bookings</small>
            </div>
          </div>

          {/* Peak Hours */}
          {metrics.peakHours.length > 0 && (
            <div className="p-4 rounded-lg border">
              <div className="flex gap-3 items-center mb-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-base">Peak Hours</h3>
              </div>
              <div className="flex gap-2">
                {metrics.peakHours.map((hour, index) => (
                  <Badge key={index} variant="secondary">
                    {hour}
                  </Badge>
                ))}
              </div>
              <small className="text-sm font-medium leading-none text-muted-foreground mt-2">Busiest times of day</small>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
