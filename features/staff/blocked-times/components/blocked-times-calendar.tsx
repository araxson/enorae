'use client'

import { useMemo } from 'react'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Grid, Box } from '@/components/layout'
import { Muted, P } from '@/components/ui/typography'
import { Calendar, Clock, Ban } from 'lucide-react'
import type { BlockedTime } from '../types'

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
  const weekDays = useMemo(() => {
    const start = startOfWeek(weekStart, { weekStartsOn: 1 }) // Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [weekStart])

  const getDayItems = (day: Date) => {
    const dayBlocked = blockedTimes.filter(bt => {
      if (!bt.start_time) return false
      return isSameDay(parseISO(bt.start_time), day)
    })

    const dayAppointments = appointments.filter(apt => {
      if (!apt.start_time) return false
      return isSameDay(parseISO(apt.start_time), day)
    })

    return { blocked: dayBlocked, appointments: dayAppointments }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Schedule
        </CardTitle>
        <Muted className="text-xs">
          Week of {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
        </Muted>
      </CardHeader>
      <CardContent>
        <Grid cols={{ base: 1, sm: 2, lg: 7 }} gap="sm">
          {weekDays.map((day) => {
            const { blocked, appointments: dayApts } = getDayItems(day)
            const isToday = isSameDay(day, new Date())

            return (
              <Card key={day.toISOString()} className={isToday ? 'border-primary' : ''}>
                <CardContent className="p-3">
                  <Stack gap="sm">
                    <Box>
                      <P className="text-sm font-semibold">
                        {format(day, 'EEE')}
                      </P>
                      <Muted className="text-xs">
                        {format(day, 'MMM d')}
                      </Muted>
                    </Box>

                    {/* Appointments */}
                    {dayApts.length > 0 && (
                      <Stack gap="xs">
                        {dayApts.slice(0, 3).map((apt) => (
                          <Box key={apt.id} className="rounded bg-blue-100 dark:bg-blue-900/20 p-2">
                            <div className="flex items-start gap-1">
                              <Clock className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                              <div className="flex-1 min-w-0">
                                <Muted className="text-xs truncate">
                                  {apt.start_time ? format(parseISO(apt.start_time), 'h:mm a') : 'TBD'}
                                </Muted>
                                <Muted className="text-xs truncate">
                                  {apt.customer_name || 'Customer'}
                                </Muted>
                              </div>
                            </div>
                          </Box>
                        ))}
                        {dayApts.length > 3 && (
                          <Muted className="text-xs">
                            +{dayApts.length - 3} more
                          </Muted>
                        )}
                      </Stack>
                    )}

                    {/* Blocked Times */}
                    {blocked.length > 0 && (
                      <Stack gap="xs">
                        {blocked.slice(0, 2).map((bt) => (
                          <Box key={bt.id} className="rounded bg-red-100 dark:bg-red-900/20 p-2">
                            <div className="flex items-start gap-1">
                              <Ban className="h-3 w-3 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
                              <div className="flex-1 min-w-0">
                                <Muted className="text-xs truncate">
                                  {bt.start_time ? format(parseISO(bt.start_time), 'h:mm a') : 'TBD'}
                                  {bt.end_time && ` - ${format(parseISO(bt.end_time), 'h:mm a')}`}
                                </Muted>
                                <Muted className="text-xs truncate">
                                  {bt.reason || bt.block_type || 'Blocked'}
                                </Muted>
                              </div>
                            </div>
                          </Box>
                        ))}
                        {blocked.length > 2 && (
                          <Muted className="text-xs">
                            +{blocked.length - 2} more
                          </Muted>
                        )}
                      </Stack>
                    )}

                    {/* Empty state */}
                    {blocked.length === 0 && dayApts.length === 0 && (
                      <Muted className="text-xs text-center py-2">
                        No events
                      </Muted>
                    )}

                    {/* Day summary */}
                    {(blocked.length > 0 || dayApts.length > 0) && (
                      <div className="flex gap-1 pt-1 border-t">
                        {dayApts.length > 0 && (
                          <Badge variant="outline" className="text-xs h-5">
                            {dayApts.length} apt{dayApts.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                        {blocked.length > 0 && (
                          <Badge variant="destructive" className="text-xs h-5">
                            {blocked.length} blocked
                          </Badge>
                        )}
                      </div>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )
          })}
        </Grid>

        {/* Legend */}
        <div className="flex gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <Muted className="text-xs">Appointments</Muted>
          </div>
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-red-600 dark:text-red-400" />
            <Muted className="text-xs">Blocked Times</Muted>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
