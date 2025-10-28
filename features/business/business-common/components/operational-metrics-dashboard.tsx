'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Activity,
  Calendar,
  Clock,
  Gauge,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <ItemMedia variant="icon">
          <Gauge className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Operational Metrics</ItemTitle>
          <ItemDescription>Real-time operational performance indicators</ItemDescription>
        </ItemContent>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-6">
          {/* Utilization Metrics */}
          <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Alert className="flex flex-col gap-3">
              <Activity className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <AlertTitle>Capacity Utilization</AlertTitle>
                <CardTitle>
                  <span className={getUtilizationColor(metrics.capacityUtilization)}>
                    {metrics.capacityUtilization}%
                  </span>
                </CardTitle>
                <Progress value={metrics.capacityUtilization} className="h-2" />
                <AlertDescription>Overall capacity usage</AlertDescription>
              </div>
            </Alert>

            <Alert className="flex flex-col gap-3">
              <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <AlertTitle>Staff Utilization</AlertTitle>
                <CardTitle>
                  <span className={getUtilizationColor(metrics.staffUtilization)}>
                    {metrics.staffUtilization}%
                  </span>
                </CardTitle>
                <Progress value={metrics.staffUtilization} className="h-2" />
                <AlertDescription>Staff productivity</AlertDescription>
              </div>
            </Alert>

            <Alert className="flex flex-col gap-3">
              <Target className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <AlertTitle>Booking Fill Rate</AlertTitle>
                <CardTitle>
                  <span className={getUtilizationColor(metrics.bookingFillRate)}>
                    {metrics.bookingFillRate}%
                  </span>
                </CardTitle>
                <Progress value={metrics.bookingFillRate} className="h-2" />
                <AlertDescription>Schedule efficiency</AlertDescription>
              </div>
            </Alert>
          </ItemGroup>

          {/* Performance Indicators */}
          <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Item variant="outline" className="flex-col gap-3">
              <ItemHeader>
                <ItemMedia variant="icon">
                  <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Average Wait Time</ItemTitle>
                  <ItemDescription>Per customer</ItemDescription>
                </ItemContent>
              </ItemHeader>
              <ItemContent>
                <CardTitle>{metrics.averageWaitTime} min</CardTitle>
              </ItemContent>
            </Item>

            <Item variant="outline" className="flex-col gap-3">
              <ItemHeader>
                <ItemMedia variant="icon">
                  <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Appointments/Day</ItemTitle>
                  <ItemDescription>Average daily bookings</ItemDescription>
                </ItemContent>
              </ItemHeader>
              <ItemContent>
                <CardTitle>{metrics.appointmentsPerDay}</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>

          {/* Peak Hours */}
          {metrics.peakHours.length > 0 && (
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <div className="flex flex-col gap-2">
                <AlertTitle>Peak Hours</AlertTitle>
                <AlertDescription>Busiest times of day</AlertDescription>
                <div className="flex flex-wrap gap-2">
                  {metrics.peakHours.map((hour, index) => (
                    <Badge key={index} variant="secondary">
                      {hour}
                    </Badge>
                  ))}
                </div>
              </div>
            </Alert>
          )}
        </div>
      </ItemContent>
    </Item>
  )
}
