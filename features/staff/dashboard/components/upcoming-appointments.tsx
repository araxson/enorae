import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Small } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared'
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
import type { AppointmentWithDetails } from '@/lib/types/app.types'
import { formatAppointmentTime } from '@/lib/utils/dates'
import { getStatusVariant } from '@/lib/constants/appointment-statuses'
import { format } from 'date-fns'
import { Clock, Calendar } from 'lucide-react'

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
          <EmptyState
            icon={Calendar}
            title="No Upcoming Appointments"
            description="No appointments scheduled for the next 7 days"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <Small>Next 7 days</Small>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {appointments.map((appointment, index) => (
            <div key={appointment.id}>
              <Item variant="outline" size="default">
                <ItemMedia>
                  <div className="flex flex-col items-center justify-center min-w-16 p-2 bg-primary/10 rounded-lg">
                    <Small className="font-bold text-xs">
                      {appointment.start_time
                        ? format(new Date(appointment.start_time), 'MMM')
                        : '---'}
                    </Small>
                    <div className="text-lg font-bold leading-none">
                      {appointment.start_time
                        ? format(new Date(appointment.start_time), 'd')
                        : '--'}
                    </div>
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    <Clock className="inline h-3 w-3" aria-hidden="true" />{' '}
                    {formatAppointmentTime(appointment.start_time)}
                  </ItemTitle>
                  <ItemDescription>
                    {appointment.customer?.full_name || 'Unknown Customer'}
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
