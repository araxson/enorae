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
import { Calendar, Clock, User, DollarSign, Mail } from 'lucide-react'
import type { StaffAppointment, AppointmentStatus } from '@/features/staff/appointments/api/queries'

type AppointmentDetailDialogProps = {
  appointment: StaffAppointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig: Record<AppointmentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
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
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p>{appointment['customer_name'] || 'Walk-in Customer'}</p>
                </div>
              </div>

              {appointment['customer_email'] && (
                <div className="flex gap-3 items-start">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p>{appointment['customer_email']}</p>
                  </div>
                </div>
              )}

              {/* TODO: Add customer_phone field to appointments view if needed */}
            </div>
          </div>

          <Separator />

          <div>
            <p className="font-semibold mb-3">Service Details</p>
            <div className="flex flex-col gap-3">
              {appointment['service_names'] && (
                <div>
                  <p className="text-xs text-muted-foreground">Services</p>
                  <p>{appointment['service_names']}</p>
                </div>
              )}

              {appointment['total_price'] !== undefined && appointment['total_price'] !== null && (
                <div className="flex gap-3 items-start">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Price</p>
                    <p className="font-medium">${Number(appointment['total_price']).toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TODO: Add notes field to appointments view if needed */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
