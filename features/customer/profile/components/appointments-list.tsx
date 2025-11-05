import { format } from 'date-fns'
import { AppointmentCard } from '@/features/shared/appointments'
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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Calendar className="size-5" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No appointments yet</EmptyTitle>
          <EmptyDescription>
            Schedule your next visit to see appointments listed here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <p className="text-sm text-muted-foreground">
            Book through the salon search to get started.
          </p>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <ItemGroup>
        <Item variant="muted" size="sm">
          <ItemMedia variant="icon">
            <Calendar className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Appointments</ItemTitle>
            <ItemDescription>
              {appointments.length}{' '}
              {appointments.length === 1 ? 'scheduled appointment' : 'scheduled appointments'}
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
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
    </div>
  )
}
