'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Muted, P } from '@/components/ui/typography'
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
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Appointment Issues
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Muted className="text-sm">Cancelled</Muted>
            <div className="flex items-center gap-2">
              <P className="text-sm font-medium">{aggregated.cancelledAppointments}</P>
              <Muted className="text-xs">({cancellationRate.toFixed(1)}%)</Muted>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Muted className="text-sm">No-Shows</Muted>
            <div className="flex items-center gap-2">
              <P className="text-sm font-medium">{aggregated.noShowAppointments}</P>
              <Muted className="text-xs">({noShowRate.toFixed(1)}%)</Muted>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
