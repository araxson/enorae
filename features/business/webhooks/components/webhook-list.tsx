'use client'

import { useState } from 'react'
import { Webhook } from 'lucide-react'
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Database } from '@/lib/types/database.types'
import { WebhookDetailDialog } from './webhook-detail-dialog'
import { WebhookListActions } from './webhook-list-actions'
import { WebhookListRow } from './webhook-list-row'

type WebhookQueue = Database['public']['Views']['communication_webhook_queue_view']['Row']

type WebhookListProps = {
  webhooks: WebhookQueue[]
}

export function WebhookList({ webhooks }: WebhookListProps) {
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookQueue | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const failedCount = webhooks.filter(w => w['status'] === 'failed').length
  const completedCount = webhooks.filter(w => w['status'] === 'completed').length

  const handleRowClick = (webhook: WebhookQueue) => {
    setSelectedWebhook(webhook)
    setIsDialogOpen(true)
  }

  if (webhooks.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Webhook className="size-8" aria-hidden="true" />
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
      <WebhookListActions failedCount={failedCount} completedCount={completedCount} />

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
            <WebhookListRow
              key={webhook['id']}
              webhook={webhook}
              onClick={() => handleRowClick(webhook)}
            />
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
