'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Webhook } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
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
import { retryAllFailedWebhooks, clearCompletedWebhooks } from '@/features/business/webhooks/api/mutations'
import { ConfirmDialog } from '@/features/shared/ui-components'

type WebhookQueue = Database['public']['Views']['communication_webhook_queue_view']['Row']

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

  const failedCount = webhooks.filter(w => w['status'] === 'failed').length
  const completedCount = webhooks.filter(w => w['status'] === 'completed').length

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
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Webhook className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No webhook entries found</EmptyTitle>
          <EmptyDescription>New webhook activity will appear here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Configure outbound webhooks to monitor delivery history.</EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <ButtonGroup>
          {failedCount > 0 ? (
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
          ) : null}

          {completedCount > 0 ? (
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
          ) : null}
        </ButtonGroup>
      </div>

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
              key={webhook['id']}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(webhook)}
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
