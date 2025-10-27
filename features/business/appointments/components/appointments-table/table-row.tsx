'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import type { AppointmentWithDetails } from '@/features/business/appointments/api/queries'
import { STATUS_CONFIG } from './status-config'

export type AppointmentAction = (formData: FormData) => Promise<void>

type AppointmentRowProps = {
  appointment: AppointmentWithDetails
  onConfirm: AppointmentAction
  onComplete: AppointmentAction
  onCancel: AppointmentAction
}

export function AppointmentsTableRow({ appointment, onConfirm, onComplete, onCancel }: AppointmentRowProps) {
  const config = STATUS_CONFIG[appointment['status'] as keyof typeof STATUS_CONFIG]
  const appointmentDate = appointment['start_time'] ? new Date(appointment['start_time']) : null

  return (
    <TableRow>
      <TableCell>
        {appointmentDate ? (
          <Field>
            <FieldLabel>{format(appointmentDate, 'MMM dd, yyyy')}</FieldLabel>
            <FieldContent>
              <FieldDescription>{format(appointmentDate, 'h:mm a')}</FieldDescription>
            </FieldContent>
          </Field>
        ) : (
          'No date'
        )}
      </TableCell>
      <TableCell>{appointment['customer_id'] || 'N/A'}</TableCell>
      <TableCell>{appointment['staff_id'] || 'N/A'}</TableCell>
      <TableCell>
        <Badge variant={config?.variant}>{config?.label || appointment['status']}</Badge>
      </TableCell>
      <TableCell>
        <Field>
          <FieldContent className="flex items-center gap-2">
            {appointment['status'] === 'pending' && appointment['id'] && (
              <form action={onConfirm}>
                <input type="hidden" name="id" value={appointment['id']} />
                <Button size="sm" variant="outline" type="submit">
                  Confirm
                </Button>
              </form>
            )}
            {appointment['status'] === 'confirmed' && appointment['id'] && (
              <form action={onComplete}>
                <input type="hidden" name="id" value={appointment['id']} />
                <Button size="sm" variant="outline" type="submit">
                  Complete
                </Button>
              </form>
            )}
            {appointment['status'] !== 'cancelled' && appointment['status'] !== 'completed' && appointment['id'] && (
              <form action={onCancel}>
                <input type="hidden" name="id" value={appointment['id']} />
                <Button size="sm" variant="destructive" type="submit">
                  Cancel
                </Button>
              </form>
            )}
          </FieldContent>
        </Field>
      </TableCell>
    </TableRow>
  )
}
