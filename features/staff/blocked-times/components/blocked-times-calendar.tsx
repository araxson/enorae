'use client'

import { useMemo } from 'react'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Ban } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { BlockedTime } from '@/features/staff/blocked-times/types'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
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
        <div className="flex items-start gap-3">
          <span className="rounded-full bg-muted p-2">
            <Calendar className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>
              Week of {weekDays[0] ? format(weekDays[0], 'MMM d') : 'N/A'} –{' '}
              {weekDays[6] ? format(weekDays[6], 'MMM d, yyyy') : 'N/A'}
            </CardDescription>
          </div>
        </div>
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
              <Clock className="size-4 text-info" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Appointments</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm" variant="muted">
            <ItemMedia variant="icon">
              <Ban className="size-4 text-destructive" aria-hidden="true" />
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
