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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <Calendar className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <DialogTitle>Appointment Details</DialogTitle>
              <ItemDescription>Review timing, customer information, and status.</ItemDescription>
            </ItemContent>
          </Item>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>

          <ItemGroup className="grid gap-4 md:grid-cols-2">
            <Item>
              <ItemMedia variant="icon">
                <Calendar className="size-5 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Date</ItemTitle>
                <ItemDescription>
                  {appointment['start_time']
                    ? format(new Date(appointment['start_time']), 'EEEE, MMMM dd, yyyy')
                    : 'N/A'}
                </ItemDescription>
              </ItemContent>
            </Item>

            <Item>
              <ItemMedia variant="icon">
                <Clock className="size-5 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Time</ItemTitle>
                <ItemDescription>
                  {appointment['start_time']
                    ? format(new Date(appointment['start_time']), 'h:mm a')
                    : 'N/A'}
                  {appointment['duration_minutes'] ? ` (${appointment['duration_minutes']} min)` : ''}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>

          <Separator />

          <div>
            <ItemGroup className="mb-3">
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>Customer Information</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <User className="size-5 text-muted-foreground" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Customer ID</ItemTitle>
                  <ItemDescription>{appointment.customer_id ?? 'No customer assigned'}</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>

          <Separator />

          <div>
            <ItemGroup className="mb-3">
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>Appointment Details</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
            <ItemGroup>
              {appointment.confirmation_code ? (
                <Item>
                  <ItemMedia variant="icon">
                    <Hash className="size-5 text-muted-foreground" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Confirmation code</ItemTitle>
                    <ItemDescription>{appointment.confirmation_code}</ItemDescription>
                  </ItemContent>
                </Item>
              ) : null}

              {appointment.duration_minutes ? (
                <Item>
                  <ItemMedia variant="icon">
                    <Clock className="size-5 text-muted-foreground" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Duration</ItemTitle>
                    <ItemDescription>{appointment.duration_minutes} minutes</ItemDescription>
                  </ItemContent>
                </Item>
              ) : null}
            </ItemGroup>

            {!appointment.duration_minutes && !appointment.confirmation_code ? (
              <p className="text-sm text-muted-foreground">
                Additional appointment details are not available in the current view.
              </p>
            ) : null}
          </div>

          {/* TODO: Add notes field to appointments view if needed */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
