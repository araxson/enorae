import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Group } from '@/components/layout'
import { Muted, Small } from '@/components/ui/typography'
import { EmptyState } from '@/components/shared'
import type { AppointmentWithDetails } from '@/lib/types/app.types'
import { getStatusConfig } from '@/lib/constants/appointment-statuses'
import { formatAppointmentDate, formatAppointmentTime } from '@/lib/utils/dates'
import { Calendar } from 'lucide-react'

interface RecentBookingsProps {
  appointments: AppointmentWithDetails[]
}

export function RecentBookings({ appointments }: RecentBookingsProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Calendar}
            title="No Recent Bookings"
            description="Recent appointments will appear here"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {appointments.map((appointment) => {
            const statusConfig = getStatusConfig(appointment.status)

            return (
              <Stack
                key={appointment.id}
                gap="xs"
                className="pb-4 border-b last:border-0 last:pb-0"
              >
                <Group gap="sm">
                  <Small>{formatAppointmentDate(appointment.start_time)}</Small>
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </Group>
                <Muted>
                  {formatAppointmentTime(appointment.start_time)} •{' '}
                  {appointment.customer?.full_name || 'Guest'} •{' '}
                  {appointment.staff?.full_name || 'Staff TBD'}
                </Muted>
              </Stack>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}
