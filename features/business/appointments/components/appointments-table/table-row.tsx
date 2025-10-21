'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { AppointmentWithDetails } from '../../api/queries'
import { STATUS_CONFIG } from './status-config'

export type AppointmentAction = (formData: FormData) => Promise<void>

type AppointmentRowProps = {
  appointment: AppointmentWithDetails
  onConfirm: AppointmentAction
  onComplete: AppointmentAction
  onCancel: AppointmentAction
}

export function AppointmentsTableRow({ appointment, onConfirm, onComplete, onCancel }: AppointmentRowProps) {
  const config = STATUS_CONFIG[appointment.status as keyof typeof STATUS_CONFIG]
  const appointmentDate = appointment.start_time ? new Date(appointment.start_time) : null

  return (
    <TableRow>
      <TableCell>
        {appointmentDate ? (
          <div className="flex flex-col gap-2">
            <div>{format(appointmentDate, 'MMM dd, yyyy')}</div>
            <p className="text-sm font-medium text-muted-foreground">{format(appointmentDate, 'h:mm a')}</p>
          </div>
        ) : (
          'No date'
        )}
      </TableCell>
      <TableCell>{appointment.customer_name || appointment.customer_email || 'N/A'}</TableCell>
      <TableCell>{appointment.staff_name || appointment.staff_name || 'N/A'}</TableCell>
      <TableCell>
        <Badge variant={config?.variant}>{config?.label || appointment.status}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          {appointment.status === 'pending' && appointment.id && (
            <form action={onConfirm}>
              <input type="hidden" name="id" value={appointment.id} />
              <Button size="sm" variant="outline" type="submit">
                Confirm
              </Button>
            </form>
          )}
          {appointment.status === 'confirmed' && appointment.id && (
            <form action={onComplete}>
              <input type="hidden" name="id" value={appointment.id} />
              <Button size="sm" variant="outline" type="submit">
                Complete
              </Button>
            </form>
          )}
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.id && (
            <form action={onCancel}>
              <input type="hidden" name="id" value={appointment.id} />
              <Button size="sm" variant="destructive" type="submit">
                Cancel
              </Button>
            </form>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
