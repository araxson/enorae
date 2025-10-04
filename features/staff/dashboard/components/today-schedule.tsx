import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack } from '@/components/layout'
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
import { Clock, User } from 'lucide-react'

interface TodayScheduleProps {
  appointments: AppointmentWithDetails[]
}

export function TodaySchedule({ appointments }: TodayScheduleProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Clock}
            title="No Appointments Today"
            description="No appointments scheduled for today"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Schedule</CardTitle>
        <Small>{appointments.length} appointments</Small>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {appointments.map((appointment, index) => (
            <div key={appointment.id}>
              <Item variant="outline" size="default">
                <ItemMedia variant="icon">
                  <Clock className="h-4 w-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {formatAppointmentTime(appointment.start_time)}
                  </ItemTitle>
                  <ItemDescription>
                    <User className="inline h-3 w-3" aria-hidden="true" />{' '}
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
