import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { confirmAppointment, cancelAppointment, completeAppointment } from '@/features/business/appointments/api/mutations'
import type { AppointmentWithDetails } from '@/features/business/appointments/api/queries'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface AppointmentsTableProps {
  appointments: AppointmentWithDetails[]
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

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  async function handleConfirm(formData: FormData) {
    const id = formData.get('id') as string
    await confirmAppointment(id)
  }

  async function handleCancel(formData: FormData) {
    const id = formData.get('id') as string
    await cancelAppointment(id)
  }

  async function handleComplete(formData: FormData) {
    const id = formData.get('id') as string
    await completeAppointment(id)
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Appointments</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => {
              const config = statusConfig[appointment['status'] as keyof typeof statusConfig]
              const appointmentDate = appointment['start_time'] ? new Date(appointment['start_time']) : null

              return (
                <TableRow key={appointment['id']}>
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
                  <TableCell>
                    {appointment['customer_id'] || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {appointment['staff_id'] || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={config?.variant}>
                      {config?.label || appointment['status']}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Field>
                      <FieldContent className="flex items-center gap-2">
                        {appointment['status'] === 'pending' && appointment['id'] && (
                          <form action={handleConfirm}>
                            <input type="hidden" name="id" value={appointment['id']} />
                            <Button size="sm" variant="outline" type="submit">
                              Confirm
                            </Button>
                          </form>
                        )}
                        {appointment['status'] === 'confirmed' && appointment['id'] && (
                          <form action={handleComplete}>
                            <input type="hidden" name="id" value={appointment['id']} />
                            <Button size="sm" variant="outline" type="submit">
                              Complete
                            </Button>
                          </form>
                        )}
                        {appointment['status'] !== 'cancelled' && appointment['status'] !== 'completed' && appointment['id'] && (
                          <form action={handleCancel}>
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
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
