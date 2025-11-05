'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
  const detailItems = [
    { icon: User, label: 'Professional', value: staffName },
    { icon: Calendar, label: 'Date', value: date },
    { icon: Clock, label: 'Time', value: time },
  ]

  return (
    <div className={cn('w-full', className)}>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{staffName}</CardDescription>
            </div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Accordion type="single" collapsible defaultValue="details">
            <AccordionItem value="details">
              <AccordionTrigger>Appointment details</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                {detailItems.map(({ icon: DetailIcon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <DetailIcon className="mt-0.5 size-4" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{label}</p>
                      <p>{value}</p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>

        {(onReschedule || onViewDetails || onCancel) && (
          <CardFooter>
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
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
