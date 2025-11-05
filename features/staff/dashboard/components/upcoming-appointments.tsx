import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
} from '@/components/ui/item'
import type { AppointmentWithDetails } from '@/features/shared/appointments/api/types'
import { formatAppointmentTime } from '@/lib/utils/dates'
import { getStatusVariant } from '@/lib/constants/appointment-statuses'
import { format } from 'date-fns'
import { Clock, Calendar } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface UpcomingAppointmentsProps {
  appointments: AppointmentWithDetails[]
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Calendar className="size-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No upcoming appointments</EmptyTitle>
              <EmptyDescription>No appointments are scheduled for the next 7 days.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <ItemDescription>Next 7 days</ItemDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {appointments.map((appointment, index) => (
            <div key={appointment.id ?? index}>
              <Item variant="outline">
                <ItemMedia variant="icon" className="size-16">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm bg-muted">
                    <p className="text-[10px] font-semibold uppercase tracking-wide">
                      {appointment.start_time
                        ? format(new Date(appointment.start_time), 'MMM')
                        : '---'}
                    </p>
                    <span className="text-base font-semibold">
                      {appointment.start_time
                        ? format(new Date(appointment.start_time), 'd')
                        : '--'}
                    </span>
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    <Clock className="inline size-3" aria-hidden="true" />{' '}
                    {formatAppointmentTime(appointment.start_time)}
                  </ItemTitle>
                  <ItemDescription>
                    {appointment.customer_id || 'Unknown Customer'}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant={getStatusVariant(appointment.status)}>
                    {appointment.status || 'pending'}
                  </Badge>
                </ItemActions>
              </Item>
              {index < appointments.length - 1 && <ItemSeparator />}
            </div>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
