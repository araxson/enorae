'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import type { RoleAuditEvent } from '@/features/admin/roles/api/queries'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface RoleAuditTimelineProps {
  events: RoleAuditEvent[]
}

export function RoleAuditTimeline({ events }: RoleAuditTimelineProps) {
  if (events.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>Recent role changes</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>
                Audit log of role assignments, updates, and revocations captured by the platform.
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <ItemGroup key={event.id}>
            <Item className="flex-col items-start gap-1">
              <ItemContent>
                <span className="text-sm font-medium">{event.action}</span>
              </ItemContent>
              <ItemContent>
                <ItemDescription>
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                  {event.userId ? ` · User ${event.userId.slice(0, 8)}` : ''}
                </ItemDescription>
              </ItemContent>
              {event.metadata ? (
                <ItemContent className="w-full">
                  <ScrollArea className="rounded-md bg-muted">
                    <pre className="p-2 text-xs text-muted-foreground">
                      {JSON.stringify(event.metadata, null, 2)}
                    </pre>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </ItemContent>
              ) : null}
            </Item>
          </ItemGroup>
        ))}
      </CardContent>
    </Card>
  )
}
