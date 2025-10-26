'use client'

import { useState } from 'react'
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
        <CardContent>
          <div className="pt-6">
            <div className="flex flex-col gap-4 text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">No Appointments</p>
                <p className="text-sm text-muted-foreground">You have no appointments in this period</p>
              </div>
            </div>
          </div>
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
        <div className="flex flex-col gap-3">
          {appointments.map((appointment) => {
            const status = (appointment.status ?? 'pending') as AppointmentStatus
            const config = statusConfig[status] || statusConfig.pending
            const isActionable = status === 'confirmed' || status === 'pending' || status === 'in_progress'
            const customerId = appointment.customer_id
            const confirmationCode = appointment.confirmation_code

            return (
              <Card key={appointment.id}>
                <CardContent>
                  <div className="p-0">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedAppointment(appointment)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setSelectedAppointment(appointment)
                        }
                      }}
                      className="flex items-start gap-4 cursor-pointer rounded-lg p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={config.variant}>{config.label}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {appointment.start_time ? format(new Date(appointment.start_time), 'MMM dd, yyyy') : 'N/A'}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
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
                      </div>

                      {showActions && isActionable ? (
                        <div className="flex gap-2" onClick={(event) => event.stopPropagation()}>
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
                        </div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      />
    </Card>
  )
}
