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
import { Card } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Shield, Activity } from 'lucide-react'
import type { AuditLog } from '../api/queries'

interface AuditLogsTableProps {
  logs: AuditLog[]
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  if (logs.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12">
        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No audit logs found</p>
        <p className="text-sm text-muted-foreground">
          Audit logs will appear here when users perform actions
        </p>
      </Card>
    )
  }

  const getEventTypeBadge = (eventType: string) => {
    const type = eventType.toLowerCase()
    if (type.includes('create')) return <Badge variant="default">Create</Badge>
    if (type.includes('update')) return <Badge variant="secondary">Update</Badge>
    if (type.includes('delete')) return <Badge variant="destructive">Delete</Badge>
    if (type.includes('login')) return <Badge variant="outline">Login</Badge>
    return <Badge variant="outline">{eventType}</Badge>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    {getEventTypeBadge(log.event_type)}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-sm">
                  {log.user_email || log.user_name || log.user_id || 'System'}
                </span>
              </TableCell>

              <TableCell>
                {log.resource_type ? (
                  <div className="text-sm">
                    <span className="font-medium">{log.resource_type}</span>
                    {log.resource_id && (
                      <span className="text-muted-foreground"> · {log.resource_id.substring(0, 8)}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>

              <TableCell>
                <span className="text-sm text-muted-foreground font-mono">
                  {log.ip_address || 'Unknown'}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
