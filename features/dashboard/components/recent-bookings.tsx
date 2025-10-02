import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Group } from '@/components/layout'
import { Muted, Small } from '@/components/ui/typography'
import type { AppointmentWithRelations } from '@/features/appointments-management/dal/appointments-management.queries'
import { format } from 'date-fns'

interface RecentBookingsProps {
  appointments: AppointmentWithRelations[]
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'outline' as const,
  },
  confirmed: {
    label: 'Confirmed',
    variant: 'default' as const,
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'destructive' as const,
  },
  completed: {
    label: 'Completed',
    variant: 'secondary' as const,
  },
}

export function RecentBookings({ appointments }: RecentBookingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <Muted>No recent bookings</Muted>
        ) : (
          <Stack gap="md">
            {appointments.map((appointment) => {
              const config = statusConfig[appointment.status as keyof typeof statusConfig]
              const appointmentDate = appointment.start_time ? new Date(appointment.start_time) : null

              return (
                <Stack
                  key={appointment.id}
                  gap="xs"
                  className="pb-4 border-b last:border-0 last:pb-0"
                >
                  <Group gap="sm">
                    <Small>
                      {appointmentDate ? format(appointmentDate, 'MMM dd, yyyy') : 'No date'}
                    </Small>
                    <Badge variant={config?.variant}>{config?.label || appointment.status}</Badge>
                  </Group>
                  <Muted>
                    {appointmentDate ? format(appointmentDate, 'h:mm a') : ''} •{' '}
                    {appointment.customer?.full_name || 'Guest'} •{' '}
                    {appointment.staff?.full_name || 'Staff TBD'}
                  </Muted>
                </Stack>
              )
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
