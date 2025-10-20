import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Stack, Group } from '@/components/layout'
import { Calendar, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <Group gap="sm" className="items-center">
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </Group>
      </CardHeader>

      <CardContent>
        <Stack gap="sm">
          <Group gap="sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <small className="text-sm font-medium leading-none text-muted-foreground">{staffName}</small>
          </Group>
          <Group gap="sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <small className="text-sm font-medium leading-none text-muted-foreground">{date}</small>
          </Group>
          <Group gap="sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <small className="text-sm font-medium leading-none text-muted-foreground">{time}</small>
          </Group>
        </Stack>
      </CardContent>

      {(onReschedule || onViewDetails || onCancel) && (
        <CardFooter>
          <Group gap="sm" className="w-full">
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                View Details
              </Button>
            )}
            {onReschedule && status !== 'cancelled' && status !== 'completed' && (
              <Button variant="outline" size="sm" onClick={onReschedule}>
                Reschedule
              </Button>
            )}
            {onCancel && status !== 'cancelled' && status !== 'completed' && (
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
                    <AlertDialogAction asChild>
                      <Button onClick={onCancel} variant="destructive">
                        Yes, Cancel Appointment
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </Group>
        </CardFooter>
      )}
    </Card>
  )
}
