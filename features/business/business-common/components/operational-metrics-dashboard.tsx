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
              <CardHeader className="pb-2">
                <div className="flex gap-3 items-center">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Capacity Utilization</CardTitle>
                </div>
                <CardDescription>Overall capacity usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className={`text-3xl font-bold ${getUtilizationColor(metrics.capacityUtilization)}`}>
                  {metrics.capacityUtilization}%
                </div>
                <Progress value={metrics.capacityUtilization} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex gap-3 items-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Staff Utilization</CardTitle>
                </div>
                <CardDescription>Staff productivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className={`text-3xl font-bold ${getUtilizationColor(metrics.staffUtilization)}`}>
                  {metrics.staffUtilization}%
                </div>
                <Progress value={metrics.staffUtilization} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex gap-3 items-center">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Booking Fill Rate</CardTitle>
                </div>
                <CardDescription>Schedule efficiency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className={`text-3xl font-bold ${getUtilizationColor(metrics.bookingFillRate)}`}>
                  {metrics.bookingFillRate}%
                </div>
                <Progress value={metrics.bookingFillRate} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex gap-3 items-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Average Wait Time</CardTitle>
                </div>
                <CardDescription>Per customer</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-2xl font-bold">{metrics.averageWaitTime} min</p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex gap-3 items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Appointments/Day</CardTitle>
                </div>
                <CardDescription>Average daily bookings</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-2xl font-bold">{metrics.appointmentsPerDay}</p>
              </CardContent>
            </Card>
          </div>

          {/* Peak Hours */}
          {metrics.peakHours.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex gap-3 items-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Peak Hours</CardTitle>
                </div>
                <CardDescription>Busiest times of day</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 pt-0">
                {metrics.peakHours.map((hour, index) => (
                  <Badge key={index} variant="secondary">
                    {hour}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
