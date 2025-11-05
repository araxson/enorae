import { format, isSameDay, parseISO } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Ban } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { BlockedTime } from '@/features/staff/blocked-times/api/types'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'

interface CalendarDayCardProps {
  day: Date
  blockedTimes: BlockedTime[]
  appointments: Array<{
    id: string
    start_time: string | null
    end_time: string | null
    customer_name: string | null
    service_names: string | null
  }>
}

export function CalendarDayCard({ day, blockedTimes, appointments }: CalendarDayCardProps) {
  const isToday = isSameDay(day, new Date())

  return (
    <Card key={day.toISOString()}>
      <CardContent>
        <div className="flex flex-col gap-3 p-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {format(day, 'EEE')}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(day, 'MMM d')}
            </p>
            {isToday ? <Badge variant="secondary" className="mt-2 w-fit">Today</Badge> : null}
          </div>

          {appointments.length > 0 && (
            <div className="flex flex-col gap-2">
              {appointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="rounded bg-info/10 p-2">
                  <div className="flex items-start gap-1">
                    <Clock className="size-3 mt-0.5 flex-shrink-0 text-info" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">
                        {apt.start_time ? format(parseISO(apt.start_time), 'h:mm a') : 'TBD'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {apt.customer_name || 'Customer'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {appointments.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{appointments.length - 3} more
                </p>
              )}
            </div>
          )}

          {blockedTimes.length > 0 && (
            <div className="flex flex-col gap-2">
              {blockedTimes.slice(0, 2).map((bt) => (
                <div key={bt.id} className="rounded bg-destructive/10 p-2">
                  <div className="flex items-start gap-1">
                    <Ban className="size-3 mt-0.5 flex-shrink-0 text-destructive" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">
                        {bt.start_time ? format(parseISO(bt.start_time), 'h:mm a') : 'TBD'}
                        {bt.end_time && ` - ${format(parseISO(bt.end_time), 'h:mm a')}`}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {bt.reason || bt.block_type || 'Blocked'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {blockedTimes.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{blockedTimes.length - 2} more
                </p>
              )}
            </div>
          )}

          {blockedTimes.length === 0 && appointments.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No events</EmptyTitle>
                <EmptyDescription>
                  Nothing scheduled for this day.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {(blockedTimes.length > 0 || appointments.length > 0) && (
            <>
              <Separator className="pt-1" />
              <div className="flex gap-1 pt-1">
                {appointments.length > 0 && (
                  <Badge variant="outline">
                    {appointments.length} apt{appointments.length !== 1 ? 's' : ''}
                  </Badge>
                )}
                {blockedTimes.length > 0 && (
                  <Badge variant="destructive">
                    {blockedTimes.length} blocked
                  </Badge>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
