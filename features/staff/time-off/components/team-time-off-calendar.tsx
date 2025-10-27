'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateSimple as formatDate } from '@/lib/utils/date-time'
import type { TeamTimeOffCalendar } from '@/features/staff/time-off/api/queries'

interface TeamTimeOffCalendarProps {
  entries: TeamTimeOffCalendar[]
}

export function TeamTimeOffCalendarSection({ entries }: TeamTimeOffCalendarProps) {
  return (
    <div className="flex flex-col gap-6">
      <span className="text-2xl font-semibold text-foreground">Team Time Off Calendar</span>
      {entries.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No upcoming time off</CardTitle>
            <CardDescription>No upcoming team time off</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <Card key={`${entry.staff_id}-${entry.start_at}`}>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{entry.staff_name}</h3>
                    {entry.staff_title && <p className="text-sm text-muted-foreground">{entry.staff_title}</p>}
                  </div>
                  <Badge variant={entry.status === 'approved' ? 'default' : 'secondary'}>
                    {entry.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-base font-medium text-foreground">
                      {formatDate(entry.start_at)} - {formatDate(entry.end_at)}
                    </span>
                    <span className="text-xs capitalize text-muted-foreground">
                      {entry.request_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
