'use client'

import { useMemo } from 'react'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Ban } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { BlockedTime } from '@/features/staff/blocked-times/types'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'

interface BlockedTimesCalendarProps {
  blockedTimes: BlockedTime[]
  appointments?: Array<{
    id: string
    start_time: string | null
    end_time: string | null
    customer_name: string | null
    service_names: string | null
  }>
  weekStart?: Date
}

export function BlockedTimesCalendar({ blockedTimes, appointments = [], weekStart = new Date() }: BlockedTimesCalendarProps) {
  const weekDays = useMemo((): Date[] => {
    const start = startOfWeek(weekStart, { weekStartsOn: 1 }) // Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [weekStart])

  const getDayItems = (day: Date) => {
    const dayBlocked = blockedTimes.filter(bt => {
      if (!bt['start_time']) return false
      return isSameDay(parseISO(bt['start_time']), day)
    })

    const dayAppointments = appointments.filter(apt => {
      if (!apt['start_time']) return false
      return isSameDay(parseISO(apt['start_time']), day)
    })

    return { blocked: dayBlocked, appointments: dayAppointments }
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <Calendar className="h-5 w-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Weekly Schedule</CardTitle>
              <ItemDescription>
                Week of {weekDays[0] ? format(weekDays[0], 'MMM d') : 'N/A'} –{' '}
                {weekDays[6] ? format(weekDays[6], 'MMM d, yyyy') : 'N/A'}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-7">
          {weekDays.map((day) => {
            const { blocked, appointments: dayApts } = getDayItems(day)
            const isToday = isSameDay(day, new Date())

            return (
              <Card key={day.toISOString()} className={isToday ? 'border-primary' : ''}>
                <CardContent>
                  <div className="flex flex-col gap-3 p-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {format(day, 'EEE')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(day, 'MMM d')}
                      </p>
                    </div>

                    {/* Appointments */}
                    {dayApts.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {dayApts.slice(0, 3).map((apt) => (
                          <div key={apt['id']} className="rounded bg-info/10 p-2">
                            <div className="flex items-start gap-1">
                              <Clock className="h-3 w-3 mt-0.5 flex-shrink-0 text-info" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground truncate">
                                  {apt['start_time'] ? format(parseISO(apt['start_time']), 'h:mm a') : 'TBD'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {apt['customer_name'] || 'Customer'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {dayApts.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{dayApts.length - 3} more
                          </p>
                        )}
                      </div>
                    )}

                    {/* Blocked Times */}
                    {blocked.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {blocked.slice(0, 2).map((bt) => (
                          <div key={bt['id']} className="rounded bg-destructive/10 p-2">
                            <div className="flex items-start gap-1">
                              <Ban className="h-3 w-3 mt-0.5 flex-shrink-0 text-destructive" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground truncate">
                                  {bt['start_time'] ? format(parseISO(bt['start_time']), 'h:mm a') : 'TBD'}
                                  {bt['end_time'] && ` - ${format(parseISO(bt['end_time']), 'h:mm a')}`}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {bt['reason'] || bt['block_type'] || 'Blocked'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {blocked.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{blocked.length - 2} more
                          </p>
                        )}
                      </div>
                    )}

                    {/* Empty state */}
                    {blocked.length === 0 && dayApts.length === 0 && (
                      <Empty>
                        <EmptyHeader>
                          <EmptyTitle>No events</EmptyTitle>
                          <EmptyDescription>
                            Nothing scheduled for this day.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    )}

                    {/* Day summary */}
                    {(blocked.length > 0 || dayApts.length > 0) && (
                      <>
                        <Separator className="pt-1" />
                        <div className="flex gap-1 pt-1">
                          {dayApts.length > 0 && (
                            <Badge variant="outline">
                              {dayApts.length} apt{dayApts.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {blocked.length > 0 && (
                            <Badge variant="destructive">
                              {blocked.length} blocked
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Legend */}
        <Separator className="mt-4" />
        <ItemGroup className="flex flex-wrap gap-2 pt-4">
          <Item size="sm" variant="muted">
            <ItemMedia variant="icon">
              <Clock className="h-4 w-4 text-info" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Appointments</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm" variant="muted">
            <ItemMedia variant="icon">
              <Ban className="h-4 w-4 text-destructive" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Blocked times</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
