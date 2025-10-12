'use client'

import { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow, format } from 'date-fns'

import type { NotificationEntry } from '../types'

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
      <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
        No notifications queued yet. Trigger events or run a test notification to populate history.
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
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
                    <div className="text-xs text-rose-600 mt-1 max-w-[220px] truncate">
                      {entry.error}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(entry.channels || []).map((channel: string) => (
                      <Badge key={channel} variant="outline" className="capitalize">
                        {channel}
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
      </div>

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
                <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">
                  {selected.message}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Payload</h4>
                <ScrollArea className="max-h-60 rounded-md border bg-muted/30 p-3 text-xs">
                  <pre>{JSON.stringify(selected.data, null, 2)}</pre>
                </ScrollArea>
              </div>
              {selected.error && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {selected.error}
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
