'use client'

import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, User, Hash } from 'lucide-react'
import type { StaffAppointment, AppointmentStatus } from '@/features/staff/appointments/api/queries'

type AppointmentDetailDialogProps = {
  appointment: StaffAppointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function AppointmentDetailDialog({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailDialogProps) {
  if (!appointment) return null

  const status = appointment['status'] as AppointmentStatus
  const config = statusConfig[status] || statusConfig.pending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-3 items-start">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">
                  {appointment['start_time']
                    ? format(new Date(appointment['start_time']), 'EEEE, MMMM dd, yyyy')
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium">
                  {appointment['start_time']
                    ? format(new Date(appointment['start_time']), 'h:mm a')
                    : 'N/A'}
                  {appointment['duration_minutes'] && ` (${appointment['duration_minutes']} min)`}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <p className="font-semibold mb-3">Customer Information</p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Customer ID</p>
                  <p>{appointment.customer_id ?? 'No customer assigned'}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <p className="font-semibold mb-3">Appointment Details</p>
            <div className="flex flex-col gap-3">
              {appointment.confirmation_code ? (
                <div className="flex gap-3 items-start">
                  <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Confirmation code</p>
                    <p>{appointment.confirmation_code}</p>
                  </div>
                </div>
              ) : null}

              {appointment.duration_minutes ? (
                <div className="flex gap-3 items-start">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">{appointment.duration_minutes} minutes</p>
                  </div>
                </div>
              ) : null}

              {!appointment.duration_minutes && !appointment.confirmation_code ? (
                <p className="text-sm text-muted-foreground">
                  Additional appointment details are not available in the current view.
                </p>
              ) : null}
            </div>
          </div>

          {/* TODO: Add notes field to appointments view if needed */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
