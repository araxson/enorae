'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
            <div className="flex flex-col items-center text-center">
              <CardTitle>No upcoming time off</CardTitle>
              <CardDescription>No upcoming team time off</CardDescription>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6">
          {entries.map((entry) => (
            <Card key={`${entry.staff_id}-${entry.start_at}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{entry.staff_name}</CardTitle>
                    {entry.staff_title && <CardDescription>{entry.staff_title}</CardDescription>}
                  </div>
                  <Badge variant={entry.status === 'approved' ? 'default' : 'secondary'}>
                    {entry.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}
