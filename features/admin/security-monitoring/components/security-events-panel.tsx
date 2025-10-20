import { Shield, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { SecurityEvent } from '../api/types'

interface SecurityEventsPanelProps {
  events: SecurityEvent[]
}

const severityBadge = (severity: string) => {
  const normalized = severity.toLowerCase()
  if (['critical', 'high'].includes(normalized)) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        {normalized}
      </Badge>
    )
  }

  if (normalized === 'warning') {
    return <Badge variant="secondary">Warning</Badge>
  }

  return <Badge variant="outline">{severity}</Badge>
}

export function SecurityEventsPanel({ events }: SecurityEventsPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <CardTitle>Security Event Stream</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No security events recorded for the selected timeframe.
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto rounded-md border">
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
                      <div className="font-medium text-foreground">{event.eventType}</div>
                      {event.description && (
                        <div className="text-xs text-muted-foreground">{event.description}</div>
                      )}
                    </TableCell>
                    <TableCell>{severityBadge(event.severity)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {event.userId ?? 'System'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {event.ipAddress ?? 'Unknown'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
