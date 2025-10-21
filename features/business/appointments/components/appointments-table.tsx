import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { confirmAppointment, cancelAppointment, completeAppointment } from '../api/mutations'
import type { AppointmentWithDetails } from '../api/queries'

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
        <CardTitle>Appointments</CardTitle>
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
              const config = statusConfig[appointment.status as keyof typeof statusConfig]
              const appointmentDate = appointment.start_time ? new Date(appointment.start_time) : null

              return (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {appointmentDate ? (
                      <div className="flex flex-col gap-2">
                        <div>{format(appointmentDate, 'MMM dd, yyyy')}</div>
                        <small className="text-sm font-medium leading-none text-muted-foreground">
                          {format(appointmentDate, 'h:mm a')}
                        </small>
                      </div>
                    ) : (
                      'No date'
                    )}
                  </TableCell>
                  <TableCell>
                    {appointment.customer_name ||
                     appointment.customer_email ||
                     'N/A'}
                  </TableCell>
                  <TableCell>
                    {appointment.staff_name ||
                     appointment.staff_name ||
                     'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={config?.variant}>
                      {config?.label || appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {appointment.status === 'pending' && appointment.id && (
                        <form action={handleConfirm}>
                          <input type="hidden" name="id" value={appointment.id} />
                          <Button size="sm" variant="outline" type="submit">
                            Confirm
                          </Button>
                        </form>
                      )}
                      {appointment.status === 'confirmed' && appointment.id && (
                        <form action={handleComplete}>
                          <input type="hidden" name="id" value={appointment.id} />
                          <Button size="sm" variant="outline" type="submit">
                            Complete
                          </Button>
                        </form>
                      )}
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.id && (
                        <form action={handleCancel}>
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
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
