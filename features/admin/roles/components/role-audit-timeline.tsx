'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import type { RoleAuditEvent } from '../api/queries'

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
        <CardTitle>Recent role changes</CardTitle>
        <p className="text-xs text-muted-foreground">
          Audit log of role assignments, updates, and revocations captured by the platform.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex flex-col gap-1">
            <div className="text-sm font-medium">{event.action}</div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
              {event.userId ? ` · User ${event.userId.slice(0, 8)}` : ''}
            </p>
            {event.metadata ? (
              <pre className="overflow-x-auto rounded-md bg-muted p-2 text-xs text-muted-foreground">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
