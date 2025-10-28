import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Calendar, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export interface AppointmentCardProps {
  title: string
  staffName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  onReschedule?: () => void
  onViewDetails?: () => void
  onCancel?: () => void
  className?: string
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'secondary' as const,
  },
  confirmed: {
    label: 'Confirmed',
    variant: 'default' as const,
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'destructive' as const,
  },
  completed: {
    label: 'Completed',
    variant: 'secondary' as const,
  },
}

export function AppointmentCard({
  title,
  staffName,
  date,
  time,
  status,
  onReschedule,
  onViewDetails,
  onCancel,
  className,
}: AppointmentCardProps) {
  const config = statusConfig[status]

  return (
    <div className={cn('w-full', className)}>
      <Item variant="outline">
      <ItemHeader>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ItemTitle>{title}</ItemTitle>
          </div>
          <ItemActions>
            <Badge variant={config.variant}>{config.label}</Badge>
          </ItemActions>
        </div>
      </ItemHeader>

      <ItemContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <User className="size-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium text-muted-foreground">{staffName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium text-muted-foreground">{date}</p>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium text-muted-foreground">{time}</p>
          </div>
        </div>
      </ItemContent>

      {(onReschedule || onViewDetails || onCancel) && (
        <ItemFooter>
          <ButtonGroup aria-label="Appointment actions">
            {onViewDetails ? (
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                View Details
              </Button>
            ) : null}
            {onReschedule && status !== 'cancelled' && status !== 'completed' ? (
              <Button variant="outline" size="sm" onClick={onReschedule}>
                Reschedule
              </Button>
            ) : null}
            {onCancel && status !== 'cancelled' && status !== 'completed' ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this appointment? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onCancel?.()}>
                      Yes, Cancel Appointment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </ButtonGroup>
        </ItemFooter>
      )}
      </Item>
    </div>
  )
}
