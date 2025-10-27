import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import type { MessageThreadWithInsights } from '@/features/admin/messages/api/queries'

interface MessagesTableProps {
  threads: MessageThreadWithInsights[]
}

const formatMinutes = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return '—'
  if (value < 1) return '<1m'
  const hours = Math.floor(value / 60)
  const minutes = Math.round(value % 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const priorityVariant = (priority: string | null | undefined) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'destructive'
    case 'high':
      return 'secondary'
    case 'low':
      return 'outline'
    default:
      return 'default'
  }
}

const statusVariant = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case 'resolved':
    case 'closed':
      return 'secondary'
    case 'archived':
      return 'outline'
    case 'in_progress':
      return 'default'
    default:
      return 'default'
  }
}

export function MessagesTable({ threads }: MessagesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Threads</CardTitle>
        <CardDescription>Conversation activity and SLA indicators.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Salon</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signals</TableHead>
                <TableHead>Unread</TableHead>
                <TableHead>First Response</TableHead>
                <TableHead>Last Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No threads match the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                threads.map((thread) => {
                  const hasAlerts = thread.hasFlaggedMessages || thread.unresolvedReports > 0
                  const rowHighlight = hasAlerts ? 'bg-muted/40' : undefined
                  const rowKey =
                    thread['id'] ??
                    `${thread['salon_id'] ?? 'salon'}-${thread['customer_id'] ?? 'customer'}-${thread['last_message_at'] ?? thread['created_at']}`
                  const customerUnread = thread['unread_count_customer'] ?? 0
                  const staffUnread = thread['unread_count_staff'] ?? 0

                  return (
                    <TableRow key={rowKey} className={rowHighlight}>
                      <TableCell className="space-y-1">
                        <div className="font-medium leading-tight">
                          {thread['subject'] || 'No subject'}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            Recent messages:&nbsp;
                            {thread.recentMessageCount}
                          </span>
                          <span>
                            Thread ID:&nbsp;
                            {thread['id'] ?? '—'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium leading-tight">{thread['salon_name']}</div>
                        <p className="text-xs text-muted-foreground">{thread['salon_id']}</p>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium leading-tight">{thread['customer_name']}</div>
                        <p className="text-xs text-muted-foreground">{thread['customer_email']}</p>
                      </TableCell>
                      <TableCell>
                        {thread['staff_name'] ? (
                          <div>
                            <div className="font-medium leading-tight">{thread['staff_name']}</div>
                            <p className="text-xs text-muted-foreground">{thread['staff_email']}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">Unassigned</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={priorityVariant(thread['priority'])}>
                          {thread['priority'] ?? 'normal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(thread['status'])}>
                          {thread['status'] ?? 'open'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {thread.hasFlaggedMessages ? (
                            <Badge variant="destructive">Flagged {thread.flaggedMessageCount}</Badge>
                          ) : null}
                          {thread.unresolvedReports > 0 ? (
                            <Badge variant="secondary">Reports {thread.unresolvedReports}</Badge>
                          ) : null}
                          {!thread.hasFlaggedMessages && thread.unresolvedReports === 0 ? (
                            <p className="text-xs text-muted-foreground">None</p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {customerUnread > 0 ? (
                            <Badge variant="outline">C: {customerUnread}</Badge>
                          ) : null}
                          {staffUnread > 0 ? (
                            <Badge variant="outline">S: {staffUnread}</Badge>
                          ) : null}
                          {customerUnread === 0 && staffUnread === 0 ? (
                            <p className="text-xs text-muted-foreground">—</p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{formatMinutes(thread.firstResponseMinutes)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {thread['last_message_at']
                          ? formatDistanceToNow(new Date(thread['last_message_at']), { addSuffix: true })
                          : 'Never'}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
