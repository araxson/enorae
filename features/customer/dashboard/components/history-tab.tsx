import { History } from 'lucide-react'
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
  return (
    <Item variant="outline" className="flex flex-col gap-4 p-6">
      <ItemHeader className="flex-col items-start gap-1 p-0">
        <ItemTitle>Past appointments</ItemTitle>
        <ItemDescription>{pastAppointments?.length ?? 0} completed</ItemDescription>
      </ItemHeader>
      <ItemContent className="p-0">
        {!pastAppointments || pastAppointments.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <History className="h-6 w-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No past appointments</EmptyTitle>
              <EmptyDescription>Your appointment history will appear here</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="gap-3">
            {pastAppointments.map((appointment) => {
              if (!appointment?.['id']) return null

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
                <Item key={appointment['id']} variant="outline" size="sm">
                  <ItemContent>
                    <ItemHeader>
                      <ItemTitle>{appointment['service_names'] || 'Service'}</ItemTitle>
                      <Badge variant="secondary">{statusLabel}</Badge>
                    </ItemHeader>
                    <ItemDescription>
                      {appointment['salon_name']
                        ? `at ${appointment['salon_name']}`
                        : 'Salon not specified'}
                    </ItemDescription>
                  </ItemContent>
                  <ItemFooter className="flex-none">
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
              )
            })}
          </ItemGroup>
        )}
      </ItemContent>
    </Item>
  )
}
