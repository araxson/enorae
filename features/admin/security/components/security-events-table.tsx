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
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'

interface SecurityEventsTableProps {
  events: SecurityEvent[]
}

export function SecurityEventsTable({ events }: SecurityEventsTableProps) {
  if (events.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Shield />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No security events found</EmptyTitle>
          <EmptyDescription>Security insights populate when suspicious or anomalous activity is detected.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Monitoring runs continuously and will surface events automatically.</EmptyContent>
      </Empty>
    )
  }

  const getSeverityBadge = (severity: string) => {
    const level = severity.toLowerCase()
    const formatted = level.replace(/\b\w/g, (char) => char.toUpperCase())
    if (level === 'critical') {
      return (
        <div className="flex items-center gap-1">
          <AlertCircle className="size-3" />
          <Badge variant="destructive">{formatted}</Badge>
        </div>
      )
    }
    if (level === 'high') {
      return (
        <div className="flex items-center gap-1">
          <AlertTriangle className="size-3" />
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
      <CardHeader>
        <div className="sr-only">
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Security events</ItemTitle>
              </ItemContent>
              <ItemContent>
                <ItemDescription>Recent platform security activity</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="-m-6">
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
                    <ItemGroup>
                      <Item variant="muted" className="items-center gap-2">
                        <ItemMedia variant="icon">
                          <Shield className="size-4 text-muted-foreground" />
                        </ItemMedia>
                        <ItemContent>
                          <span className="font-medium">{event.event_type}</span>
                        </ItemContent>
                      </Item>
                    </ItemGroup>
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
        </div>
      </CardContent>
    </Card>
  )
}
