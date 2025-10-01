import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@enorae/ui'
import { AppointmentRow } from './appointment-row'
import type { Appointment } from '../types/appointment.types'

interface AppointmentsTableProps {
  appointments: Appointment[]
}

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No appointments found
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <AppointmentRow
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </TableBody>
    </Table>
  )
}