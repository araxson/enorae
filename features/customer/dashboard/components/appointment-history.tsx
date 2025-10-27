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
  ItemGroup,
  ItemMedia,
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
              <History className="h-5 w-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Past appointments</CardTitle>
              <CardDescription>
                Review your booking history and salon visits.
              </CardDescription>
            </ItemContent>
            <ItemActions className="flex-none">
              <ItemDescription>{appointments?.length ?? 0} completed</ItemDescription>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        {!appointments || appointments.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <History className="h-8 w-8" aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No past appointments</EmptyTitle>
              <EmptyDescription>Your appointment history will appear here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="gap-3">
            {appointments.map((appointment) => {
              if (!appointment?.['id']) return null

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
                <Item key={appointment['id']} variant="muted" size="sm">
                  <ItemContent>
                    <ItemTitle>{serviceLabel}</ItemTitle>
                    <ItemDescription>{salonLabel}</ItemDescription>
                  </ItemContent>
                  <ItemActions className="flex-none flex-col items-end gap-1">
                    {appointmentDate ? (
                      <ItemDescription>
                        <time dateTime={appointment['start_time'] || undefined}>{appointmentDate}</time>
                      </ItemDescription>
                    ) : null}
                    <Badge variant="outline">
                      {statusLabel}
                    </Badge>
                  </ItemActions>
                </Item>
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
