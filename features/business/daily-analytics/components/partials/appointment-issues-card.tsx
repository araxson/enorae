'use client'

import { AlertCircle } from 'lucide-react'
import type { DailyMetricsDashboardProps } from '../types'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader className="items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <ItemTitle>Appointment Issues</ItemTitle>
      </ItemHeader>
      <ItemContent>
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
      </ItemContent>
    </Item>
  )
}
