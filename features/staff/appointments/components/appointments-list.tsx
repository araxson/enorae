'use client'

import { Fragment, useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, CheckCircle, XCircle, Play, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ActionButton } from '@/features/shared/ui-components'
import {
  markAppointmentCompleted,
  markAppointmentNoShow,
  startAppointment,
  confirmAppointment,
  type AppointmentStatus,
} from '@/features/staff/appointments/api/mutations'
import type { StaffAppointment } from '@/features/staff/appointments/api/queries'
import { useRouter } from 'next/navigation'
import { AppointmentDetailDialog } from './appointment-detail-dialog'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

type AppointmentsListProps = {
  appointments: StaffAppointment[]
  title?: string
  showActions?: boolean
}

const statusConfig: Record<AppointmentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'outline' },
  pending: { label: 'Pending', variant: 'outline' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  checked_in: { label: 'Checked In', variant: 'secondary' },
  in_progress: { label: 'In Progress', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
  rescheduled: { label: 'Rescheduled', variant: 'outline' },
}

export function AppointmentsList({ appointments, title = 'Appointments', showActions = true }: AppointmentsListProps) {
  const router = useRouter()
  const [selectedAppointment, setSelectedAppointment] = useState<StaffAppointment | null>(null)

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Calendar className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No appointments scheduled</EmptyTitle>
              <EmptyDescription>
                Appointments in this period will appear here once they are booked.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</p>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {appointments.map((appointment, index) => {
            const status = (appointment.status ?? 'pending') as AppointmentStatus
            const config = statusConfig[status] || statusConfig.pending
            const isActionable = status === 'confirmed' || status === 'pending' || status === 'in_progress'
            const customerId = appointment.customer_id
            const confirmationCode = appointment.confirmation_code

            return (
              <Fragment key={appointment.id}>
                <Item
                  role="button"
                  tabIndex={0}
                  variant="outline"
                  className="cursor-pointer transition-colors hover:bg-accent"
                  onClick={() => setSelectedAppointment(appointment)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedAppointment(appointment)
                    }
                  }}
                >
                  <ItemContent>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={config.variant}>{config.label}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        {appointment.start_time ? format(new Date(appointment.start_time), 'MMM dd, yyyy') : 'N/A'}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        {appointment.start_time ? format(new Date(appointment.start_time), 'h:mm a') : 'N/A'}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{customerId ?? 'No customer assigned'}</span>
                      </div>
                      {confirmationCode ? (
                        <p className="text-xs text-muted-foreground">Confirmation {confirmationCode}</p>
                      ) : null}
                    </div>

                    {appointment.duration_minutes ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{appointment.duration_minutes} minutes</span>
                      </div>
                    ) : null}
                  </ItemContent>

                  {showActions && isActionable ? (
                    <ItemActions onClick={(event) => event.stopPropagation()}>
                      <ButtonGroup>
                        {status === 'pending' ? (
                          <ActionButton
                            size="sm"
                            variant="outline"
                            onAction={async () => {
                              await confirmAppointment(appointment.id!)
                              router.refresh()
                            }}
                            successMessage="Appointment confirmed"
                            loadingText="Confirming..."
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Confirm
                          </ActionButton>
                        ) : null}
                        {status === 'confirmed' ? (
                          <ActionButton
                            size="sm"
                            onAction={async () => {
                              await startAppointment(appointment.id!)
                              router.refresh()
                            }}
                            successMessage="Appointment started"
                            loadingText="Starting..."
                          >
                            <Play className="mr-1 h-4 w-4" />
                            Start
                          </ActionButton>
                        ) : null}
                        {status === 'in_progress' ? (
                          <>
                            <ActionButton
                              size="sm"
                              onAction={async () => {
                                await markAppointmentCompleted(appointment.id!)
                                router.refresh()
                              }}
                              successMessage="Appointment completed"
                              loadingText="Completing..."
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Complete
                            </ActionButton>
                            <ActionButton
                              size="sm"
                              variant="destructive"
                              onAction={async () => {
                                await markAppointmentNoShow(appointment.id!)
                                router.refresh()
                              }}
                              successMessage="Marked as no-show"
                              loadingText="Updating..."
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              No Show
                            </ActionButton>
                          </>
                        ) : null}
                      </ButtonGroup>
                    </ItemActions>
                  ) : null}
                </Item>
                {index < appointments.length - 1 ? <ItemSeparator /> : null}
              </Fragment>
            )
          })}
        </ItemGroup>
      </CardContent>

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      />
    </Card>
  )
}
