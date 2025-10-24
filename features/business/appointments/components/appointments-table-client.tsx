'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTableEmpty } from '@/components/shared'
import { Calendar } from 'lucide-react'
import type { AppointmentWithDetails } from '@/features/business/appointments/api/queries'
import { confirmAppointment, cancelAppointment, completeAppointment } from '@/features/business/appointments/api/mutations'
import { useAppointmentsFilter } from './appointments-table/use-appointments-filter'
import { AppointmentsFilterControls } from './appointments-table/filter-controls'
import { AppointmentsTableRow } from './appointments-table/table-row'

interface AppointmentsTableClientProps {
  appointments: AppointmentWithDetails[]
}

export function AppointmentsTableClient({ appointments }: AppointmentsTableClientProps) {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredAppointments,
  } = useAppointmentsFilter(appointments)

  if (appointments.length === 0) {
    return (
      <DataTableEmpty
        icon={Calendar}
        title="No appointments yet"
        description="Appointments will appear here once customers book services"
      />
    )
  }

  const handleConfirm = createActionHandler(confirmAppointment)
  const handleCancel = createActionHandler(cancelAppointment)
  const handleComplete = createActionHandler(completeAppointment)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
        <AppointmentsFilterControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </CardHeader>
      <CardContent>
        {filteredAppointments.length === 0 ? (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No appointments match your search criteria
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
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
              {filteredAppointments.map((appointment) => (
                <AppointmentsTableRow
                  key={appointment.id}
                  appointment={appointment}
                  onConfirm={handleConfirm}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function createActionHandler(action: (id: string) => Promise<unknown>) {
  return async (formData: FormData) => {
    const id = formData.get('id') as string
    if (!id) return
    await action(id)
  }
}
