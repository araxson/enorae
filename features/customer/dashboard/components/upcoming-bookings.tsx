import { Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { DashboardAppointment } from '@/features/customer/dashboard/api/queries/appointments'
import { formatAppointmentTime } from '@/lib/utils/dates'
import { getStatusVariant } from '@/lib/constants/appointment-statuses'
import { format } from 'date-fns'
import { Calendar, MapPin, Clock, ChevronRight, Store } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'

interface UpcomingBookingsProps {
  appointments: DashboardAppointment[]
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
          <Empty>
            <EmptyMedia variant="icon">
              <Calendar className="h-6 w-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No Upcoming Appointments</EmptyTitle>
              <EmptyDescription>You don't have any upcoming appointments</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/customer/salons">Book an Appointment</Link>
              </Button>
            </EmptyContent>
          </Empty>
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
          <div className="p-6">
            <ItemGroup className="gap-4">
            {appointments.map((appointment, index) => {
              const salonInitials = getInitials(appointment['salon_name'] || 'Salon')
              const appointmentDate = appointment['start_time']
                ? format(new Date(appointment['start_time']), 'EEEE, MMMM d, yyyy')
                : 'Date TBD'

              return (
                <Fragment key={appointment['id']}>
                    <Item variant="outline" size="sm">
                      <ItemMedia variant="icon">
                        <Avatar className="h-10 w-10 border-2 border-background">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {salonInitials}
                          </AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemHeader>
                          <ItemTitle>{appointment['salon_name'] || 'Salon TBD'}</ItemTitle>
                          <Badge variant={getStatusVariant(appointment['status'])}>
                            {appointment['status'] || 'pending'}
                          </Badge>
                        </ItemHeader>
                        <ItemDescription>{appointmentDate}</ItemDescription>
                        <ItemDescription>
                          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            <span>{formatAppointmentTime(appointment['start_time'])}</span>
                          </span>
                        </ItemDescription>
                        {appointment['salon_name'] ? (
                          <ItemDescription>
                            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" aria-hidden="true" />
                              <span>View location</span>
                            </span>
                          </ItemDescription>
                        ) : null}
                      </ItemContent>
                      <ItemActions className="ml-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 transition-opacity group-hover/item:opacity-100"
                          asChild
                        >
                          <Link href={`/customer/appointments/${appointment['id']}`}>
                            View
                          </Link>
                        </Button>
                      </ItemActions>
                    </Item>
                    {index < appointments.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              )
            })}
            </ItemGroup>
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
