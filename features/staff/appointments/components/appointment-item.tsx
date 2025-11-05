'use client'

import { format } from 'date-fns'
import { Calendar, Clock, CheckCircle, XCircle, Play, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ActionButton } from '@/features/shared/ui'
import {
  markAppointmentCompleted,
  markAppointmentNoShow,
  startAppointment,
  confirmAppointment,
  type AppointmentStatus,
} from '@/features/staff/appointments/api/mutations'
import type { StaffAppointment } from '@/features/staff/appointments/api/queries'
import { useRouter } from 'next/navigation'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type AppointmentItemProps = {
  appointment: StaffAppointment
  showActions?: boolean
  onSelect: () => void
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

export function AppointmentItem({
  appointment,
  showActions = true,
  onSelect,
}: AppointmentItemProps) {
  const router = useRouter()
  const status = (appointment.status ?? 'pending') as AppointmentStatus
  const config = statusConfig[status] || statusConfig.pending
  const isActionable = status === 'confirmed' || status === 'pending' || status === 'in_progress'
  const customerId = appointment.customer_id
  const confirmationCode = appointment.confirmation_code

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <Item
      role="button"
      tabIndex={0}
      variant="outline"
      className="cursor-pointer transition-colors hover:bg-accent"
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <ItemContent>
        <ItemTitle>
          <Badge variant={config.variant}>{config.label}</Badge>
          <Calendar className="size-4" aria-hidden="true" />
          {appointment.start_time ? format(new Date(appointment.start_time), 'MMM dd, yyyy') : 'N/A'}
          <Clock className="size-4" aria-hidden="true" />
          {appointment.start_time ? format(new Date(appointment.start_time), 'h:mm a') : 'N/A'}
        </ItemTitle>
        <ItemDescription>
          <User className="inline size-4" />
          {' '}{customerId ?? 'No customer assigned'}
          {confirmationCode && ` • Confirmation ${confirmationCode}`}
        </ItemDescription>
        {appointment.duration_minutes ? (
          <ItemDescription>
            <Clock className="inline size-3" />
            {' '}{appointment.duration_minutes} minutes
          </ItemDescription>
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
                <CheckCircle className="mr-1 size-4" />
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
                <Play className="mr-1 size-4" />
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
                  <CheckCircle className="mr-1 size-4" />
                  Complete
                </ActionButton>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <XCircle className="mr-1 size-4" />
                      No Show
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mark as no-show?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark the appointment as a no-show and notify the client record. You can still add notes afterwards.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep appointment</AlertDialogCancel>
                      <AlertDialogAction asChild>
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
                          Confirm no-show
                        </ActionButton>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : null}
          </ButtonGroup>
        </ItemActions>
      ) : null}
    </Item>
  )
}
