'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Calendar } from 'lucide-react'
import type { AppointmentWithDetails } from '@/features/business/appointments/api/queries'
import { confirmAppointment, cancelAppointment, completeAppointment } from '@/features/business/appointments/api/mutations'
import { useAppointmentsFilter } from './appointments-table/use-appointments-filter'
import { AppointmentsFilterControls } from './appointments-table/filter-controls'
import { AppointmentsTableRow } from './appointments-table/table-row'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
      <Empty>
        <EmptyMedia variant="icon">
          <Calendar className="h-6 w-6" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No appointments yet</EmptyTitle>
          <EmptyDescription>Appointments will appear here once customers book services.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Promote services or invite clients to start tracking activity.</EmptyContent>
      </Empty>
    )
  }

  const handleConfirm = createActionHandler(confirmAppointment)
  const handleCancel = createActionHandler(cancelAppointment)
  const handleComplete = createActionHandler(completeAppointment)

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="items-start justify-between gap-4">
            <ItemContent>
              <ItemTitle>Appointments</ItemTitle>
            </ItemContent>
            <ItemActions className="flex flex-col gap-3 md:flex-row md:items-center">
              <AppointmentsFilterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
              />
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        {filteredAppointments.length === 0 ? (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No matching appointments</EmptyTitle>
                      <EmptyDescription>Try adjusting your filters to see more results.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
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
