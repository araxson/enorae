import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { AppointmentsOverview } from './admin-overview-types'
import { appointmentStatusVariant, safeFormatDate } from './admin-overview-utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
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
              <EmptyTitle>No appointment activity</EmptyTitle>
              <EmptyDescription>Bookings will appear here once appointments are created.</EmptyDescription>
            </EmptyHeader>
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
          <ItemGroup className="space-y-3">
            {rows.map((apt) => (
              <Item key={apt['id']} variant="outline" className="flex-col gap-3">
                <ItemContent>
                  <ItemGroup>
                    <Item variant="muted">
                      <ItemContent>
                        <ItemTitle>{apt['salon_name'] || 'Unknown salon'}</ItemTitle>
                        <ItemDescription>
                          {apt['customer_name'] || 'Unknown customer'} · {apt['service_name'] || 'Service pending'}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant={appointmentStatusVariant[apt['status'] ?? ''] ?? 'secondary'}>
                          {apt['status'] || 'pending'}
                        </Badge>
                      </ItemActions>
                    </Item>
                  </ItemGroup>
                  <Separator />
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>
                      Created {safeFormatDate(apt['created_at'], 'MMM d, yyyy', 'recently')}
                    </span>
                    <span>
                      Scheduled {safeFormatDate(apt['start_time'], 'MMM d, yyyy p', 'TBD')}
                    </span>
                  </div>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
