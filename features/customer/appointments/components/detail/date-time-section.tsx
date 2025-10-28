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
            <CalendarDays className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Date &amp; time</ItemTitle>
            <ItemDescription>
              {start ? (
                <time dateTime={appointment['start_time'] ?? undefined}>
                  {start.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              ) : (
                'Date to be determined'
              )}
            </ItemDescription>
            <ItemDescription className="text-muted-foreground">
              {start ? (
                <time dateTime={appointment['start_time'] ?? undefined}>
                  {start.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              ) : (
                '—'
              )}
              {' — '}
              {end ? (
                <time dateTime={appointment['end_time'] ?? undefined}>
                  {end.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              ) : (
                '—'
              )}
            </ItemDescription>
          </ItemContent>
          <ItemMedia variant="icon">
            <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
          </ItemMedia>
        </Item>
      </ItemGroup>

      <ItemGroup>
        <Item variant="muted" size="sm">
          <ItemMedia variant="icon">
            <Clock className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Duration</ItemTitle>
            <ItemDescription>{appointment['duration_minutes'] || 0} minutes total</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

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
