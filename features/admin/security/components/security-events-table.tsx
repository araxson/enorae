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
import { formatDistanceToNow } from 'date-fns'
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react'
import type { SecurityEvent } from '@/features/admin/security/api/queries'
import { DataTableEmpty } from '@/features/shared/ui-components'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface SecurityEventsTableProps {
  events: SecurityEvent[]
}

export function SecurityEventsTable({ events }: SecurityEventsTableProps) {
  if (events.length === 0) {
    return (
      <DataTableEmpty
        icon={Shield}
        title="No security events found"
        description="Security events will appear here when suspicious or anomalous activity is detected."
      />
    )
  }

  const getSeverityBadge = (severity: string) => {
    const level = severity.toLowerCase()
    const formatted = level.replace(/\b\w/g, (char) => char.toUpperCase())
    if (level === 'critical') {
      return (
        <div className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <Badge variant="destructive">{formatted}</Badge>
        </div>
      )
    }
    if (level === 'high') {
      return (
        <div className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <Badge variant="destructive">{formatted}</Badge>
        </div>
      )
    }
    if (level === 'medium') {
      return <Badge variant="secondary">{formatted}</Badge>
    }
    return <Badge variant="outline">{formatted}</Badge>
  }

  return (
    <Card>
      <CardHeader className="sr-only">
        <CardTitle>Security events</CardTitle>
        <CardDescription>Recent platform security activity</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
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
                    <span className="font-mono text-sm text-muted-foreground">
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
