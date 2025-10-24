import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyState } from '@/components/shared'
import type { AppointmentWithDetails } from '@/features/business/appointments'
import { formatAppointmentTime } from '@/lib/utils/dates'
import { getStatusVariant } from '@/lib/constants/appointment-statuses'
import { format } from 'date-fns'
import { Calendar, MapPin, Clock, ChevronRight, Store } from 'lucide-react'
import Link from 'next/link'

interface UpcomingBookingsProps {
  appointments: AppointmentWithDetails[]
}

export function UpcomingBookings({ appointments }: UpcomingBookingsProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled appointments will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Calendar}
            title="No Upcoming Appointments"
            description="You don't have any upcoming appointments"
            action={
              <Button asChild>
                <Link href="/customer/salons">Book an Appointment</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    )
  }

  const getInitials = (name: string) => {
    if (!name) return 'S'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>{appointments.length} scheduled</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/customer/appointments">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-6 space-y-4">
            {appointments.map((appointment) => {
              const salonInitials = getInitials(appointment.salon_name || 'Salon')
              const appointmentDate = appointment.start_time
                ? format(new Date(appointment.start_time), 'EEEE, MMMM d, yyyy')
                : 'Date TBD'

              return (
                <Card key={appointment.id} className="group">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {salonInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 min-w-0">
                      <CardTitle>{appointment.salon_name || 'Salon TBD'}</CardTitle>
                      <CardDescription>{appointmentDate}</CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(appointment.status)}>
                      {appointment.status || 'pending'}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatAppointmentTime(appointment.start_time)}</span>
                    </div>
                    {appointment.salon_name && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>View location</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      asChild
                    >
                      <Link href={`/customer/appointments/${appointment.id}`}>
                        View
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Button variant="outline" asChild className="w-full">
          <Link href="/customer/salons">
            <Store className="mr-2 h-4 w-4" />
            Book Another Appointment
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
