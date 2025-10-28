'use client'

import { useMemo, useState } from 'react'
import { Bell } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow, format } from 'date-fns'

import type { NotificationEntry } from '@/features/business/notifications/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

type NotificationHistoryTableProps = {
  history: NotificationEntry[]
}

const statusTone: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  delivered: 'default',
  sent: 'default',
  queued: 'secondary',
  sending: 'secondary',
  opened: 'default',
  clicked: 'default',
  failed: 'destructive',
  bounced: 'destructive',
  unsubscribed: 'outline',
}

export function NotificationHistoryTable({ history }: NotificationHistoryTableProps) {
  const [selected, setSelected] = useState<NotificationEntry | null>(null)

  const recentHistory = useMemo(
    () => history.slice(0, 50),
    [history]
  )

  if (recentHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification history</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No notifications yet</EmptyTitle>
              <EmptyDescription>Trigger events or send a test notification to populate history.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Notification history</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Queued</TableHead>
              <TableHead className="w-20 text-right">Details</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {recentHistory.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <Badge variant={statusTone[entry.status || 'queued'] || 'secondary'}>
                    {entry.status || 'queued'}
                  </Badge>
                  {entry.error && (
                    <div className="mt-1 max-w-xs truncate text-xs text-destructive">
                      {entry.error}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(entry.channels || []).map((channel: string) => (
                      <Badge key={channel} variant="outline">
                        <span className="capitalize">{channel}</span>
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="capitalize text-sm text-muted-foreground">
                  {(entry.event_type || 'other').replace(/_/g, ' ')}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{entry.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{entry.message}</div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {entry.created_at
                    ? formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })
                    : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => setSelected(entry)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4">
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant={statusTone[selected.status || 'queued'] || 'default'}>
                    {selected.status}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {selected.created_at ? format(new Date(selected.created_at), 'PPpp') : 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold">{selected.title}</h4>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                  {selected.message}
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Payload</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-60">
                    <pre className="text-xs">{JSON.stringify(selected.data, null, 2)}</pre>
                  </ScrollArea>
                </CardContent>
              </Card>
              {selected.error && (
                <Alert variant="destructive">
                  <AlertDescription>{selected.error}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
