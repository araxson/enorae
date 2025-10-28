'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { TeamTimeOffCalendar } from '@/features/staff/time-off/api/queries'

interface TeamCalendarTabProps {
  teamCalendar: TeamTimeOffCalendar[]
}

export function TeamCalendarTab({ teamCalendar }: TeamCalendarTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Team Time Off Calendar</h2>
        <p className="text-sm text-muted-foreground">See upcoming requests across the staff.</p>
      </div>
      {teamCalendar.length === 0 ? (
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No upcoming time off</EmptyTitle>
                <EmptyDescription>No upcoming team time off</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {teamCalendar.map((entry, idx) => (
            <Card key={`${entry['staff_id']}-${idx}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>{entry['staff_name']}</CardTitle>
                    {entry.staff_title && (
                      <CardDescription>{entry.staff_title}</CardDescription>
                    )}
                  </div>
                  <Badge variant={entry['status'] === 'approved' ? 'default' : 'secondary'}>
                    {entry['status']}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <ItemTitle>
                        {new Date(entry.start_at).toLocaleDateString()} – {new Date(entry.end_at).toLocaleDateString()}
                      </ItemTitle>
                      <ItemDescription>
                        <span className="capitalize">
                          {entry.request_type.replace('_', ' ')}
                        </span>
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
