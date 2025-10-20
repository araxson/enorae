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
import type { AppointmentWithDetails } from '@/lib/types/app.types'

type AppointmentHistoryProps = {
  appointments: AppointmentWithDetails[]
}

export function AppointmentHistory({ appointments }: AppointmentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Past appointments</CardTitle>
        <CardDescription>
          Review your booking history and salon visits.
        </CardDescription>
        <CardDescription>
          {appointments?.length ?? 0} completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!appointments || appointments.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <History className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No past appointments</EmptyTitle>
              <EmptyDescription>Your appointment history will appear here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => {
              if (!appointment?.id) return null

              const appointmentDate = appointment.start_time
                ? new Date(appointment.start_time).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Date not available'

              return (
                <Card key={appointment.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6">
                      <div>
                        <span className="text-xs font-medium text-foreground">
                          {Array.isArray(appointment.service_names) && appointment.service_names.length > 0
                            ? appointment.service_names.join(', ')
                            : appointment.service_name ?? 'Service'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {appointment.salon_name
                            ? `at ${appointment.salon_name}`
                            : 'Salon not specified'}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{appointmentDate}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
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
