import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import type { AppointmentsOverview } from './admin-overview-types'
import { appointmentStatusVariant, formatCurrency } from './admin-overview-utils'

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
          <p className="text-sm text-muted-foreground">No appointment activity to display yet.</p>
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
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-3">
            {rows.map((apt) => (
              <div key={apt.id} className="rounded-lg border border-border/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {apt.salon_name || 'Unknown salon'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {apt.customer_name || 'Unknown customer'} • {apt.service_count || 0} service(s)
                    </p>
                  </div>
                  <Badge
                    variant={appointmentStatusVariant[apt.status ?? ''] ?? 'secondary'}
                    className="capitalize"
                  >
                    {apt.status || 'pending'}
                  </Badge>
                </div>
                <Separator className="my-3" />
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>
                    Created {apt.created_at ? format(new Date(apt.created_at), 'MMM d, yyyy') : 'recently'}
                  </span>
                  <span>Revenue {formatCurrency(apt.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
