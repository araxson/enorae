'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react'
import type { SecurityEvent } from '../api/queries'

interface SecurityEventsTableProps {
  events: SecurityEvent[]
}

export function SecurityEventsTable({ events }: SecurityEventsTableProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No security events found</p>
            <p className="text-sm text-muted-foreground">
              Security events will appear here when suspicious activity is detected
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSeverityBadge = (severity: string) => {
    const level = severity.toLowerCase()
    if (level === 'critical') {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Critical
        </Badge>
      )
    }
    if (level === 'high') {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          High
        </Badge>
      )
    }
    if (level === 'medium') {
      return <Badge variant="secondary">Medium</Badge>
    }
    return <Badge variant="outline">Low</Badge>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>User</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{event.event_type}</span>
                </div>
              </TableCell>

              <TableCell>{getSeverityBadge(event.severity)}</TableCell>

              <TableCell>
                <span className="text-sm">
                  {event.user_email || event.user_id || 'Unknown'}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm text-muted-foreground font-mono">
                  {event.ip_address || 'Unknown'}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
