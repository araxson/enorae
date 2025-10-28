'use client'

import { useMemo } from 'react'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Ban } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { BlockedTime } from '@/features/staff/blocked-times/types'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { CalendarDayCard } from './calendar-day-card'

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
            return (
              <CalendarDayCard
                key={day.toISOString()}
                day={day}
                blockedTimes={blocked}
                appointments={dayApts}
              />
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
