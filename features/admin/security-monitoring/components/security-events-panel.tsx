import type { ComponentProps } from 'react'
import { Shield, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import type { SecurityEvent } from '@/features/admin/security-monitoring/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface SecurityEventsPanelProps {
  events: SecurityEvent[]
}

const severityVariant: Record<string, ComponentProps<typeof Badge>['variant']> = {
  critical: 'destructive',
  high: 'destructive',
  warning: 'default',
  info: 'secondary',
  low: 'secondary',
}

const severityBadge = (severity: string) => {
  const normalized = severity.toLowerCase()
  const label = normalized.replace(/\b\w/g, (char) => char.toUpperCase())
  const variant = severityVariant[normalized] ?? 'outline'
  return (
    <Badge variant={variant}>
      {['critical', 'high'].includes(normalized) ? (
        <>
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          {' '}
        </>
      ) : null}
      {label}
    </Badge>
  )
}

export function SecurityEventsPanel({ events }: SecurityEventsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" aria-hidden="true" />
          <CardTitle>Security Event Stream</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <CardDescription>No security events recorded for the selected timeframe.</CardDescription>
        ) : (
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Detected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>{event.eventType}</div>
                      {event.description ? (
                        <CardDescription>{event.description}</CardDescription>
                      ) : null}
                    </TableCell>
                    <TableCell>{severityBadge(event.severity)}</TableCell>
                    <TableCell>{event.userId ?? 'System'}</TableCell>
                    <TableCell>
                      <code>{event.ipAddress ?? 'Unknown'}</code>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
