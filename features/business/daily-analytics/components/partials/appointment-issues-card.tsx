'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import type { DailyMetricsDashboardProps } from '../types'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'

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
        <FieldSet className="space-y-2">
          <Field orientation="horizontal" className="items-center justify-between gap-3">
            <FieldLabel>Cancelled</FieldLabel>
            <FieldContent className="flex items-center gap-2">
              <div className="text-sm font-medium">{aggregated.cancelledAppointments}</div>
              <FieldDescription>({cancellationRate.toFixed(1)}%)</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal" className="items-center justify-between gap-3">
            <FieldLabel>No-shows</FieldLabel>
            <FieldContent className="flex items-center gap-2">
              <div className="text-sm font-medium">{aggregated.noShowAppointments}</div>
              <FieldDescription>({noShowRate.toFixed(1)}%)</FieldDescription>
            </FieldContent>
          </Field>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
