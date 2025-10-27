import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { AppointmentsOverview } from './admin-overview-types'
import { appointmentStatusVariant, safeFormatDate } from './admin-overview-utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

type AppointmentsTabProps = {
  appointments: AppointmentsOverview[]
}

export function AdminOverviewAppointmentsTab({ appointments }: AppointmentsTabProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent appointments</CardTitle>
          <CardDescription>
            Latest bookings created across the platform.
          </CardDescription>
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
        <CardTitle>Recent appointments</CardTitle>
        <CardDescription>
          Latest bookings created across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-3">
            {rows.map((apt) => (
              <Card key={apt['id']}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle>{apt['salon_name'] || 'Unknown salon'}</CardTitle>
                    <Badge
                      variant={appointmentStatusVariant[apt['status'] ?? ''] ?? 'secondary'}
                      className="capitalize"
                    >
                      {apt['status'] || 'pending'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {apt['customer_name'] || 'Unknown customer'} • {apt['service_name'] || 'Service pending'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <Separator />
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>
                      Created {safeFormatDate(apt['created_at'], 'MMM d, yyyy', 'recently')}
                    </span>
                    <span>
                      Scheduled {safeFormatDate(apt['start_time'], 'MMM d, yyyy p', 'TBD')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
