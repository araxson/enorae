import { CalendarDays, Clock } from 'lucide-react'
import type { AppointmentDetailContentProps } from './types'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'

export function DateTimeSection({
  appointment,
}: Pick<AppointmentDetailContentProps, 'appointment'>) {
  if (!appointment) {
    return null
  }

  const start = appointment['start_time']
    ? new Date(appointment['start_time'])
    : null
  const end = appointment['end_time'] ? new Date(appointment['end_time']) : null

  return (
    <div className="flex flex-col gap-6">
      <ItemGroup className="gap-4">
        <Item variant="outline" size="sm">
          <ItemMedia variant="icon">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Date &amp; time</ItemTitle>
            <ItemDescription>
              {start
                ? start.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Date to be determined'}
            </ItemDescription>
            <ItemDescription className="text-muted-foreground">
              {start
                ? start.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'}
              {' — '}
              {end
                ? end.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'}
            </ItemDescription>
          </ItemContent>
          <ItemMedia variant="icon">
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </ItemMedia>
        </Item>
      </ItemGroup>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" aria-hidden="true" />
        <span>{appointment['duration_minutes'] || 0} minutes total</span>
      </div>

      {appointment['staff_name'] ? (
        <>
          <Separator />
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Staff member</ItemTitle>
                <ItemDescription className="text-foreground">
                  {appointment['staff_name']}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </>
      ) : null}
    </div>
  )
}
