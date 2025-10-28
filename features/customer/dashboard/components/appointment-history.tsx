import { Fragment } from 'react'
import { History } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import type { DashboardAppointment } from '@/features/customer/dashboard/api/queries/appointments'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'

type AppointmentHistoryProps = {
  appointments: DashboardAppointment[]
}

export function AppointmentHistory({ appointments }: AppointmentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <History className="size-5" aria-hidden="true" />
            </ItemMedia>
          <ItemContent>
            <CardTitle>Past appointments</CardTitle>
            <CardDescription>
              Review your booking history and salon visits.
            </CardDescription>
          </ItemContent>
          <ItemActions>
            <ItemDescription>{appointments?.length ?? 0} completed</ItemDescription>
          </ItemActions>
        </Item>
      </ItemGroup>
      </CardHeader>
      <CardContent>
        {!appointments || appointments.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <History className="size-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No past appointments</EmptyTitle>
              <EmptyDescription>Your appointment history will appear here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup>
            {appointments.map((appointment, index) => {
              if (!appointment?.['id']) {
                return null
              }

              const appointmentDate = appointment['start_time']
                ? new Date(appointment['start_time']).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : null

              const serviceLabel = appointment['service_names'] || 'Service'
              const salonLabel = appointment['salon_name']
                ? `at ${appointment['salon_name']}`
                : 'Salon not specified'
              const statusLabel = (appointment['status'] ?? 'pending')
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase())

              return (
                <Fragment key={appointment['id']}>
                  <Item variant="muted" size="sm">
                    <ItemHeader>
                      <ItemTitle>{serviceLabel}</ItemTitle>
                      <Badge variant="outline">{statusLabel}</Badge>
                    </ItemHeader>
                    <ItemContent>
                      <ItemDescription>{salonLabel}</ItemDescription>
                    </ItemContent>
                    <ItemFooter>
                      <ItemDescription>
                        {appointmentDate ? (
                          <time dateTime={appointment['start_time'] || undefined}>
                            {appointmentDate}
                          </time>
                        ) : (
                          'Date not available'
                        )}
                      </ItemDescription>
                    </ItemFooter>
                  </Item>
                  {index < appointments.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              )
            })}
          </ItemGroup>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <CardDescription>
          Need receipts? Visit the transactions tab to download invoices.
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
