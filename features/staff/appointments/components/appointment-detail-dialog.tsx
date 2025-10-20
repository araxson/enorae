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
import { Stack, Flex } from '@/components/layout'
import { Calendar, Clock, User, DollarSign, Mail } from 'lucide-react'
import type { StaffAppointment, AppointmentStatus } from '../api/queries'

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

  const status = appointment.status as AppointmentStatus
  const config = statusConfig[status] || statusConfig.pending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>

        <Stack gap="lg">
          <div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Flex gap="sm" align="start">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground text-xs">Date</p>
                <p className="leading-7 font-medium">
                  {appointment.start_time
                    ? format(new Date(appointment.start_time), 'EEEE, MMMM dd, yyyy')
                    : 'N/A'}
                </p>
              </div>
            </Flex>

            <Flex gap="sm" align="start">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground text-xs">Time</p>
                <p className="leading-7 font-medium">
                  {appointment.start_time
                    ? format(new Date(appointment.start_time), 'h:mm a')
                    : 'N/A'}
                  {appointment.duration_minutes && ` (${appointment.duration_minutes} min)`}
                </p>
              </div>
            </Flex>
          </div>

          <Separator />

          <div>
            <p className="leading-7 font-semibold mb-3">Customer Information</p>
            <Stack gap="sm">
              <Flex gap="sm" align="start">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground text-xs">Name</p>
                  <p className="leading-7">{appointment.customer_name || 'Walk-in Customer'}</p>
                </div>
              </Flex>

              {appointment.customer_email && (
                <Flex gap="sm" align="start">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground text-xs">Email</p>
                    <p className="leading-7">{appointment.customer_email}</p>
                  </div>
                </Flex>
              )}

              {/* TODO: Add customer_phone field to appointments view if needed */}
            </Stack>
          </div>

          <Separator />

          <div>
            <p className="leading-7 font-semibold mb-3">Service Details</p>
            <Stack gap="sm">
              {appointment.service_names && (
                <div>
                  <p className="text-sm text-muted-foreground text-xs">Services</p>
                  <p className="leading-7">{appointment.service_names}</p>
                </div>
              )}

              {appointment.total_price !== undefined && appointment.total_price !== null && (
                <Flex gap="sm" align="start">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground text-xs">Total Price</p>
                    <p className="leading-7 font-medium">${Number(appointment.total_price).toFixed(2)}</p>
                  </div>
                </Flex>
              )}
            </Stack>
          </div>

          {/* TODO: Add notes field to appointments view if needed */}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
