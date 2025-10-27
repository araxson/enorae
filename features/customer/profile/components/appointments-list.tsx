import { format } from 'date-fns'
import { AppointmentCard } from '@/features/shared/appointments'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Database } from '@/lib/types/database.types'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Calendar } from 'lucide-react'

type Appointment = Database['public']['Views']['appointments_view']['Row']
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
        <CardContent className="p-6">
          <Empty>
            <EmptyMedia variant="icon">
              <Calendar className="h-6 w-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No appointments yet</EmptyTitle>
              <EmptyDescription>
                Schedule your next visit to see appointments listed here.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              Book through the salon search to get started.
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {appointments.map((appointment) => {
        const appointmentDate = appointment.start_time ? new Date(appointment.start_time) : null
        const status = isValidStatus(appointment.status) ? appointment.status : 'pending'

        const appt = appointment as AppointmentWithDetails
        return (
          <AppointmentCard
            key={appointment.id}
            title={appt.salon?.name || 'Salon appointment'}
            staffName={appt.staff?.full_name || appt.staff?.title || 'Staff TBD'}
            date={appointmentDate ? format(appointmentDate, 'MMM dd, yyyy') : 'No date'}
            time={appointmentDate ? format(appointmentDate, 'h:mm a') : ''}
            status={status}
            onViewDetails={() => {}}
          />
        )
      })}
    </div>
  )
}
