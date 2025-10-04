import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { Small } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

interface UpcomingBookingsProps {
  appointments: AppointmentWithDetails[]
}

export function UpcomingBookings({ appointments }: UpcomingBookingsProps) {
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
            description="You don't have any upcoming appointments"
            action={
              <Button asChild>
                <Link href="/customer/salons">Book an Appointment</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <Small>{appointments.length} scheduled</Small>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <ItemGroup>
            {appointments.map((appointment, index) => (
              <div key={appointment.id}>
                <Item variant="outline" size="default">
                  <ItemMedia variant="icon">
                    <Calendar className="h-4 w-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {appointment.start_time
                        ? format(new Date(appointment.start_time), 'EEEE, MMMM d, yyyy')
                        : 'Date TBD'}
                    </ItemTitle>
                    <ItemDescription>
                      {formatAppointmentTime(appointment.start_time)} •{' '}
                      <MapPin className="inline h-3 w-3" aria-hidden="true" />{' '}
                      {appointment.salon_name || 'Salon TBD'}
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
          <Button variant="outline" asChild className="w-full">
            <Link href="/customer/salons">Book Another</Link>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
