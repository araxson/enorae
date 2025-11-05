import { Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { DashboardAppointment } from '@/features/customer/dashboard/api/queries'
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
          <CardTitle>Upcoming appointments</CardTitle>
          <CardDescription>Your scheduled appointments will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Calendar className="size-5" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No upcoming appointments</EmptyTitle>
              <EmptyDescription>
                You don&apos;t have any upcoming appointments.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/customer/salons">Book an appointment</Link>
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
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Upcoming appointments</CardTitle>
            <CardDescription>{appointments.length} scheduled</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customer/appointments">
              View all
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="flex flex-col gap-4 p-6">
            {appointments.map((appointment, index) => {
              const salonInitials = getInitials(appointment['salon_name'] || 'Salon')
              const appointmentDate = appointment['start_time']
                ? format(new Date(appointment['start_time']), 'EEEE, MMMM d, yyyy')
                : 'Date TBD'

              return (
                <Fragment key={appointment['id']}>
                  <Item variant="outline" size="sm">
                    <ItemMedia>
                      <Avatar>
                        <AvatarFallback>{salonInitials}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        {appointment['salon_name'] || 'Salon TBD'}
                        <Badge variant={getStatusVariant(appointment['status'])}>
                          {appointment['status'] || 'pending'}
                        </Badge>
                      </ItemTitle>
                      <ItemDescription>{appointmentDate}</ItemDescription>
                      <ItemDescription>
                        <Clock className="inline size-3" aria-hidden="true" />{' '}
                        {formatAppointmentTime(appointment['start_time'])}
                      </ItemDescription>
                      {appointment['salon_name'] ? (
                        <ItemDescription>
                          <MapPin className="inline size-3" aria-hidden="true" /> View location
                        </ItemDescription>
                      ) : null}
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" size="sm" asChild>
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
          </div>
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href="/customer/salons">
            <Store className="size-4" aria-hidden="true" />
            Book another appointment
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
