'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import type { DailyMetricsDashboardProps } from '../types'

type Props = Pick<DailyMetricsDashboardProps, 'aggregated'>

export function AppointmentIssuesCard({ aggregated }: Props) {
  const cancellationRate =
    aggregated.totalAppointments > 0
      ? (aggregated.cancelledAppointments / aggregated.totalAppointments) * 100
      : 0

  const noShowRate =
    aggregated.totalAppointments > 0
      ? (aggregated.noShowAppointments / aggregated.totalAppointments) * 100
      : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <CardTitle>Appointment Issues</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Cancelled</div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{aggregated.cancelledAppointments}</div>
              <div className="text-xs text-muted-foreground">({cancellationRate.toFixed(1)}%)</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">No-Shows</div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{aggregated.noShowAppointments}</div>
              <div className="text-xs text-muted-foreground">({noShowRate.toFixed(1)}%)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
