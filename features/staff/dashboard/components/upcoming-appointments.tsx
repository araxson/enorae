import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { AppointmentWithDetails } from '@/features/business/appointments'
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
        <p className="text-sm font-medium">Next 7 days</p>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {appointments.map((appointment, index) => (
            <div key={appointment.id}>
              <Item variant="outline" size="default">
                <ItemMedia>
                  <Card>
                    <CardContent>
                      <div className="flex w-16 flex-col items-center justify-center gap-1 p-2">
                        <p className="text-xs font-semibold">
                          {appointment.start_time
                            ? format(new Date(appointment.start_time), 'MMM')
                            : '---'}
                        </p>
                        <div className="text-lg font-semibold">
                          {appointment.start_time
                            ? format(new Date(appointment.start_time), 'd')
                            : '--'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    <Clock className="inline h-3 w-3" aria-hidden="true" />{' '}
                    {formatAppointmentTime(appointment.start_time)}
                  </ItemTitle>
                  <ItemDescription>
                    {appointment.customer_name || 'Unknown Customer'}
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
