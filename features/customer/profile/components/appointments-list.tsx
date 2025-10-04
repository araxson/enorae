import { AppointmentCard } from '@/components/shared'
import { Grid, Box } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Muted } from '@/components/ui/typography'
import type { Database } from '@/lib/types/database.types'
import { format } from 'date-fns'

type Appointment = Database['public']['Views']['appointments']['Row']
type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

type AppointmentWithDetails = Appointment & {
  salon?: { name: string } | null
  staff?: { full_name?: string; title?: string } | null
}

interface AppointmentsListProps {
  appointments: Appointment[]
}

function isValidStatus(status: string | null): status is AppointmentStatus {
  return status !== null && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box pt="md">
            <Muted>No appointments yet</Muted>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid cols={{ base: 1, md: 2 }} gap="lg">
      {appointments.map((appointment) => {
        const appointmentDate = appointment.start_time ? new Date(appointment.start_time) : null
        const status = isValidStatus(appointment.status) ? appointment.status : 'pending'

        const appt = appointment as AppointmentWithDetails
        return (
          <AppointmentCard
            key={appointment.id}
            title={appt.salon?.name || 'Salon Appointment'}
            staffName={appt.staff?.full_name || appt.staff?.title || 'Staff TBD'}
            date={appointmentDate ? format(appointmentDate, 'MMM dd, yyyy') : 'No date'}
            time={appointmentDate ? format(appointmentDate, 'h:mm a') : ''}
            status={status}
            onViewDetails={() => {}}
          />
        )
      })}
    </Grid>
  )
}
