'use client'

import { Fragment, useState } from 'react'
import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StaffAppointment } from '@/features/staff/appointments/api/queries'
import { AppointmentDetailDialog } from './appointment-detail-dialog'
import { AppointmentItem } from './appointment-item'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ItemGroup, ItemSeparator } from '@/components/ui/item'

type AppointmentsListProps = {
  appointments: StaffAppointment[]
  title?: string
  showActions?: boolean
}

export function AppointmentsList({ appointments, title = 'Appointments', showActions = true }: AppointmentsListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<StaffAppointment | null>(null)

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Calendar className="size-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No appointments scheduled</EmptyTitle>
              <EmptyDescription>
                Appointments in this period will appear here once they are booked.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {appointments.map((appointment, index) => (
            <Fragment key={appointment.id}>
              <AppointmentItem
                appointment={appointment}
                showActions={showActions}
                onSelect={() => setSelectedAppointment(appointment)}
              />
              {index < appointments.length - 1 ? <ItemSeparator /> : null}
            </Fragment>
          ))}
        </ItemGroup>
      </CardContent>

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      />
    </Card>
  )
}
