'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, CheckCircle, XCircle, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
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
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<StaffAppointment | null>(null)

  const handleStatusChange = async (appointmentId: string, action: () => Promise<unknown>) => {
    try {
      setLoading(appointmentId)
      await action()
      router.refresh()
    } catch (error) {
      console.error('Error updating appointment:', error)
      alert('Failed to update appointment')
    } finally {
      setLoading(null)
    }
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Stack gap="md" className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <P className="font-medium">No Appointments</P>
              <Muted>You have no appointments in this period</Muted>
            </div>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Muted>{appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</Muted>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          {appointments.map((appointment) => {
            const status = appointment.status as AppointmentStatus
            const config = statusConfig[status] || statusConfig.pending
            const isActionable = status === 'confirmed' || status === 'pending' || status === 'in_progress'
            const isLoading = loading === appointment.id

            return (
              <div
                key={appointment.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => setSelectedAppointment(appointment)}
              >
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
                    <P className="font-medium">{appointment.customer_name || 'Walk-in Customer'}</P>
                    {appointment.customer_email && (
                      <Muted className="text-sm">{appointment.customer_email}</Muted>
                    )}
                  </div>

                  {appointment.service_names && (
                    <div className="flex items-center gap-1 text-sm">
                      <Muted>{appointment.service_names}</Muted>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment.id!, () => confirmAppointment(appointment.id!))}
                        disabled={isLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                    )}
                    {status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id!, () => startAppointment(appointment.id!))}
                        disabled={isLoading}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {status === 'in_progress' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(appointment.id!, () => markAppointmentCompleted(appointment.id!))}
                          disabled={isLoading}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(appointment.id!, () => markAppointmentNoShow(appointment.id!))}
                          disabled={isLoading}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          No Show
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </Stack>
      </CardContent>

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      />
    </Card>
  )
}
