import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar } from 'lucide-react'
import type { AppointmentsOverview } from './admin-overview-types'
import { appointmentStatusVariant, safeFormatDate } from './admin-overview-utils'
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
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type AppointmentsTabProps = {
  appointments: AppointmentsOverview[]
}

export function AdminOverviewAppointmentsTab({ appointments }: AppointmentsTabProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Recent appointments</ItemTitle>
                <ItemDescription>
                  Latest bookings created across the platform.
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Calendar aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No appointment activity</EmptyTitle>
              <EmptyDescription>
                Bookings will appear here once appointments are created.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>Encourage salons to accept bookings to populate this view.</EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const rows = appointments.slice(0, 20)

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Recent appointments</ItemTitle>
              <ItemDescription>
                Latest bookings created across the platform.
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <ItemGroup>
            {rows.map((apt) => (
              <Item key={apt['id']} variant="outline" size="sm" className="flex-col gap-3">
                <ItemHeader>
                  <ItemTitle>{apt['salon_name'] || 'Unknown salon'}</ItemTitle>
                  <ItemActions>
                    <Badge variant={appointmentStatusVariant[apt['status'] ?? ''] ?? 'secondary'}>
                      {apt['status'] || 'pending'}
                    </Badge>
                  </ItemActions>
                </ItemHeader>
                <ItemContent>
                  <ItemDescription>
                    {apt['customer_name'] || 'Unknown customer'} · {apt['service_name'] || 'Service pending'}
                  </ItemDescription>
                </ItemContent>
                <ItemFooter className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>
                    Created {safeFormatDate(apt['created_at'], 'MMM d, yyyy', 'recently')}
                  </span>
                  <span>
                    Scheduled {safeFormatDate(apt['start_time'], 'MMM d, yyyy p', 'TBD')}
                  </span>
                </ItemFooter>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
