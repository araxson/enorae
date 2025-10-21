'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, CheckCircle, XCircle, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ActionButton } from '@/components/shared'
import {
  markAppointmentCompleted,
  markAppointmentNoShow,
  startAppointment,
  confirmAppointment,
  type AppointmentStatus,
} from '../api/mutations'
import type { StaffAppointment } from '../api/queries'
import { useRouter } from 'next/navigation'
import { AppointmentDetailDialog } from './appointment-detail-dialog'

type AppointmentsListProps = {
  appointments: StaffAppointment[]
  title?: string
  showActions?: boolean
}

const statusConfig: Record<AppointmentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
}

export function AppointmentsList({ appointments, title = 'Appointments', showActions = true }: AppointmentsListProps) {
  const router = useRouter()
  const [selectedAppointment, setSelectedAppointment] = useState<StaffAppointment | null>(null)

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No Appointments</p>
              <p className="text-sm text-muted-foreground">You have no appointments in this period</p>
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
            const status = appointment.status as AppointmentStatus
            const config = statusConfig[status] || statusConfig.pending
            const isActionable = status === 'confirmed' || status === 'pending' || status === 'in_progress'

            return (
              <Card
                key={appointment.id}
                className="cursor-pointer transition-colors hover:bg-accent/50"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={config.variant}>{config.label}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {appointment.start_time ? format(new Date(appointment.start_time), 'MMM dd, yyyy') : 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {appointment.start_time ? format(new Date(appointment.start_time), 'h:mm a') : 'N/A'}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">{appointment.customer_name || 'Walk-in Customer'}</p>
                    {appointment.customer_email && (
                      <p className="text-sm text-muted-foreground">{appointment.customer_email}</p>
                    )}
                  </div>

                  {appointment.service_names && (
                    <div className="flex items-center gap-1 text-sm">
                      <p className="text-sm text-muted-foreground">{appointment.service_names}</p>
                    </div>
                  )}

                  {appointment.duration_minutes && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{appointment.duration_minutes} minutes</span>
                    </div>
                  )}
                  </div>

                  {showActions && isActionable && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {status === 'pending' && (
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
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm
                      </ActionButton>
                    )}
                    {status === 'confirmed' && (
                      <ActionButton
                        size="sm"
                        onAction={async () => {
                          await startAppointment(appointment.id!)
                          router.refresh()
                        }}
                        successMessage="Appointment started"
                        loadingText="Starting..."
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </ActionButton>
                    )}
                    {status === 'in_progress' && (
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
                          <CheckCircle className="w-4 h-4 mr-1" />
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
                          <XCircle className="w-4 h-4 mr-1" />
                          No Show
                        </ActionButton>
                      </>
                    )}
                  </div>
                )}
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
