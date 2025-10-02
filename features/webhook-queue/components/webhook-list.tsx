'use client'

import { Webhook } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Database } from '@/lib/types/database.types'
import { format } from 'date-fns'

type WebhookQueue = Database['communication']['Tables']['webhook_queue']['Row']

type WebhookListProps = {
  webhooks: WebhookQueue[]
}

const STATUS_COLORS = {
  pending: 'secondary',
  sent: 'default',
  failed: 'destructive',
  retrying: 'secondary',
} as const

export function WebhookList({ webhooks }: WebhookListProps) {
  if (webhooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <Webhook className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No webhook entries found</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Created</TableHead>
          <TableHead>Event Type</TableHead>
          <TableHead>Endpoint</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Attempts</TableHead>
          <TableHead>Sent At</TableHead>
          <TableHead>Error</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {webhooks.map((webhook) => (
          <TableRow key={webhook.id}>
            <TableCell>
              <div className="text-sm">
                {format(new Date(webhook.created_at), 'MMM dd, yyyy')}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(webhook.created_at), 'HH:mm:ss')}
              </div>
            </TableCell>
            <TableCell>
              <code className="text-xs">webhook</code>
            </TableCell>
            <TableCell>
              <div className="max-w-[200px] truncate text-sm">
                {webhook.url}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_COLORS[webhook.status as keyof typeof STATUS_COLORS]}>
                {webhook.status}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {webhook.attempts || 0}
              </span>
            </TableCell>
            <TableCell>
              {webhook.completed_at ? (
                <div className="text-sm">
                  {format(new Date(webhook.completed_at), 'MMM dd, HH:mm')}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                {webhook.last_error || '-'}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
