'use client'

import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import type { Database } from '@/lib/types/database.types'
import { format } from 'date-fns'

type WebhookQueue = Database['public']['Views']['communication_webhook_queue_view']['Row']

const STATUS_COLORS = {
  pending: 'secondary',
  sent: 'default',
  failed: 'destructive',
  retrying: 'secondary',
} as const

interface WebhookListRowProps {
  webhook: WebhookQueue
  onClick: () => void
}

export function WebhookListRow({ webhook, onClick }: WebhookListRowProps) {
  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={onClick}
    >
      <TableCell>
        <div className="text-sm">
          {webhook['created_at'] ? format(new Date(webhook['created_at']), 'MMM dd, yyyy') : '-'}
        </div>
        <div className="text-xs text-muted-foreground">
          {webhook['created_at'] ? format(new Date(webhook['created_at']), 'HH:mm:ss') : '-'}
        </div>
      </TableCell>
      <TableCell>
        <code className="text-xs">webhook</code>
      </TableCell>
      <TableCell>
        <div className="max-w-xs truncate text-sm">
          {webhook['url']}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={STATUS_COLORS[webhook['status'] as keyof typeof STATUS_COLORS]}>
          {webhook['status']}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm">
          {webhook['attempts'] || 0}
        </span>
      </TableCell>
      <TableCell>
        {webhook['completed_at'] ? (
          <div className="text-sm">
            {format(new Date(webhook['completed_at']), 'MMM dd, HH:mm')}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {webhook['last_error'] || '-'}
        </div>
      </TableCell>
    </TableRow>
  )
}
