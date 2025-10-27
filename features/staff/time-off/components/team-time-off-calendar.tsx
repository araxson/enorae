'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateSimple as formatDate } from '@/lib/utils/date-time'
import type { TeamTimeOffCalendar } from '@/features/staff/time-off/api/queries'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface TeamTimeOffCalendarProps {
  entries: TeamTimeOffCalendar[]
}

export function TeamTimeOffCalendarSection({ entries }: TeamTimeOffCalendarProps) {
  return (
    <div className="flex flex-col gap-6">
      <ItemGroup>
        <Item variant="muted">
          <ItemContent>
            <CardTitle>Team Time Off Calendar</CardTitle>
            <ItemDescription>Track upcoming leave for everyone on the team.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      {entries.length === 0 ? (
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
          {entries.map((entry) => {
            const requestLabel = entry.request_type
              .split('_')
              .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
              .join(' ')
            return (
              <Card key={`${entry.staff_id}-${entry.start_at}`}>
                <CardHeader>
                  <ItemGroup>
                    <Item>
                      <ItemContent>
                        <ItemTitle>{entry.staff_name}</ItemTitle>
                        {entry.staff_title ? (
                          <ItemDescription>{entry.staff_title}</ItemDescription>
                        ) : null}
                      </ItemContent>
                      <ItemActions>
                        <Badge variant={entry.status === 'approved' ? 'default' : 'secondary'}>
                          {entry.status}
                        </Badge>
                      </ItemActions>
                    </Item>
                  </ItemGroup>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ItemGroup>
                    <Item>
                      <ItemContent>
                        <ItemTitle>
                          {formatDate(entry.start_at)} – {formatDate(entry.end_at)}
                        </ItemTitle>
                        <ItemDescription>{requestLabel}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
