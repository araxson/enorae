import { Fragment } from 'react'
import { History } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'

interface HistoryTabProps {
  pastAppointments: Array<{
    id?: string | null
    start_time?: string | null
    service_names?: string | null
    salon_name?: string | null
    status?: string | null
  }> | null
}

export function HistoryTab({ pastAppointments }: HistoryTabProps) {
  const appointmentCount = pastAppointments?.length ?? 0

  if (!pastAppointments || pastAppointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Past appointments</CardTitle>
          <CardDescription>
            We'll show your completed visits once you have history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <History className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No past appointments</EmptyTitle>
              <EmptyDescription>Your appointment history will appear here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past appointments</CardTitle>
        <CardDescription>{appointmentCount} completed</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {pastAppointments.map((appointment, index) => {
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

            const statusLabel = (appointment['status'] ?? 'pending')
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase())

            return (
              <Fragment key={appointment['id']}>
                <Item variant="outline" size="sm">
                  <ItemHeader>
                    <ItemTitle>{appointment['service_names'] || 'Service'}</ItemTitle>
                    <Badge variant="secondary">{statusLabel}</Badge>
                  </ItemHeader>
                  <ItemContent>
                    <ItemDescription>
                      {appointment['salon_name']
                        ? `at ${appointment['salon_name']}`
                        : 'Salon not specified'}
                    </ItemDescription>
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
                {index < pastAppointments.length - 1 ? <ItemSeparator /> : null}
              </Fragment>
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
