'use client'

import { Badge } from '@enorae/ui'
import { Button } from '@enorae/ui'
import { TableCell, TableRow } from '@enorae/ui'
import { confirmAppointment, cancelAppointment, markAsCompleted } from '../actions/appointments.actions'
import type { Appointment } from '../types/appointment.types'

interface AppointmentRowProps {
  appointment: Appointment
}

export function AppointmentRow({ appointment }: AppointmentRowProps) {
  const startDate = appointment.start_time
    ? new Date(appointment.start_time)
    : null

  const statusVariant = {
    draft: 'secondary',
    pending: 'secondary',
    confirmed: 'default',
    checked_in: 'default',
    in_progress: 'default',
    completed: 'outline',
    cancelled: 'destructive',
    no_show: 'destructive',
    rescheduled: 'secondary',
  }[appointment.status || 'pending'] as 'default' | 'secondary' | 'destructive' | 'outline'

  const handleConfirm = async () => {
    if (appointment.id) {
      await confirmAppointment(appointment.id)
    }
  }

  const handleCancel = async () => {
    if (appointment.id && confirm('Cancel this appointment?')) {
      await cancelAppointment(appointment.id)
    }
  }

  const handleComplete = async () => {
    if (appointment.id) {
      await markAsCompleted(appointment.id)
    }
  }

  const isPending = appointment.status === 'pending'
  const isConfirmed = appointment.status === 'confirmed'
  const isCancelled = appointment.status === 'cancelled'

  return (
    <TableRow>
      <TableCell>
        {startDate ? (
          <div>
            <div className="font-medium">
              {startDate.toLocaleDateString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {startDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ) : (
          'No date'
        )}
      </TableCell>
      <TableCell>
        {appointment.confirmation_code || 'N/A'}
      </TableCell>
      <TableCell>
        {appointment.duration_minutes || 'N/A'} min
      </TableCell>
      <TableCell>
        <Badge variant={statusVariant}>
          {appointment.status || 'pending'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {isPending && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
          {isConfirmed && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleComplete}
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
          {isCancelled && (
            <span className="text-sm text-muted-foreground">
              Cancelled
            </span>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}