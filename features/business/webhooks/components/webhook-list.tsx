'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Webhook } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flex } from '@/components/layout'
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
import { WebhookDetailDialog } from './webhook-detail-dialog'
import { retryAllFailedWebhooks, clearCompletedWebhooks } from '../api/mutations'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'

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
  const router = useRouter()
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookQueue | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRetryingAll, setIsRetryingAll] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const failedCount = webhooks.filter(w => w.status === 'failed').length
  const completedCount = webhooks.filter(w => w.status === 'sent').length

  const handleRowClick = (webhook: WebhookQueue) => {
    setSelectedWebhook(webhook)
    setIsDialogOpen(true)
  }

  const handleRetryAll = async () => {
    if (failedCount === 0 || isRetryingAll) return

    setIsRetryingAll(true)
    const result = await retryAllFailedWebhooks()

    if (result.success) {
      toast.success(`Retrying ${failedCount} failed webhook(s)`)
      router.refresh()
    } else if (result.error) {
      toast.error(result.error)
    }

    setIsRetryingAll(false)
  }

  const handleClearCompleted = async () => {
    if (completedCount === 0 || isClearing) return

    setIsClearing(true)
    const result = await clearCompletedWebhooks()

    if (result.success) {
      toast.success(`Cleared ${result.data.count} webhook(s)`) 
      router.refresh()
    } else if (result.error) {
      toast.error(result.error)
    }

    setIsClearing(false)
  }

  if (webhooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <Webhook className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No webhook entries found</p>
      </div>
    )
  }

  return (
    <>
      <Flex justify="end" gap="sm" className="mb-4">
        {failedCount > 0 && (
          <ConfirmDialog
            title="Retry All Failed Webhooks?"
            description={`Retry ${failedCount} failed webhook${failedCount === 1 ? '' : 's'} now?`}
            confirmText="Retry"
            onConfirm={handleRetryAll}
          >
            <Button variant="outline" disabled={isRetryingAll}>
              {isRetryingAll ? 'Retrying...' : `Retry All Failed (${failedCount})`}
            </Button>
          </ConfirmDialog>
        )}

        {completedCount > 0 && (
          <ConfirmDialog
            title="Clear Completed Webhooks?"
            description="Remove completed webhooks older than 30 days. This action cannot be undone."
            confirmText="Clear"
            onConfirm={handleClearCompleted}
          >
            <Button variant="outline" disabled={isClearing}>
              {isClearing ? 'Clearing...' : 'Clear Old Completed'}
            </Button>
          </ConfirmDialog>
        )}
      </Flex>

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
            <TableRow
              key={webhook.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(webhook)}
            >
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

      <WebhookDetailDialog
        webhook={selectedWebhook}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
