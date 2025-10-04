'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'
import { H4, Small } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database.types'
import { retryWebhook, deleteWebhook } from '../api/mutations'

type WebhookQueue = Database['communication']['Tables']['webhook_queue']['Row']

interface WebhookDetailDialogProps {
  webhook: WebhookQueue | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_COLORS = {
  pending: 'secondary',
  sent: 'default',
  failed: 'destructive',
  retrying: 'secondary',
} as const

export function WebhookDetailDialog({
  webhook,
  open,
  onOpenChange,
}: WebhookDetailDialogProps) {
  const [isRetrying, setIsRetrying] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!webhook) return null

  const handleRetry = async () => {
    setIsRetrying(true)
    setError(null)
    setSuccess(null)

    const result = await retryWebhook(webhook.id)

    if (result.success) {
      setSuccess('Webhook queued for retry')
      setTimeout(() => {
        onOpenChange(false)
        window.location.reload()
      }, 1500)
    } else {
      setError(result.error)
    }

    setIsRetrying(false)
  }

  const handleDelete = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete this webhook entry? This action cannot be undone.'
    )

    if (!confirmed) return

    setIsDeleting(true)
    setError(null)
    setSuccess(null)

    const result = await deleteWebhook(webhook.id)

    if (result.success) {
      setSuccess('Webhook deleted successfully')
      setTimeout(() => {
        onOpenChange(false)
        window.location.reload()
      }, 1500)
    } else {
      setError(result.error)
    }

    setIsDeleting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Webhook Details</DialogTitle>
          <DialogDescription>
            View payload, response, and retry webhook delivery
          </DialogDescription>
        </DialogHeader>

        <Stack gap="lg">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Status & Metadata */}
          <Stack gap="md">
            <Flex gap="md" align="center">
              <H4 className="mb-0">Status</H4>
              <Badge variant={STATUS_COLORS[webhook.status as keyof typeof STATUS_COLORS]}>
                {webhook.status}
              </Badge>
            </Flex>

            <Stack gap="sm">
              <Flex gap="sm">
                <Small className="text-muted-foreground w-32">URL:</Small>
                <Small className="break-all">{webhook.url}</Small>
              </Flex>

              <Flex gap="sm">
                <Small className="text-muted-foreground w-32">Attempts:</Small>
                <Small>{webhook.attempts || 0}</Small>
              </Flex>

              <Flex gap="sm">
                <Small className="text-muted-foreground w-32">Created:</Small>
                <Small>{format(new Date(webhook.created_at), 'MMM dd, yyyy HH:mm:ss')}</Small>
              </Flex>

              {webhook.completed_at && (
                <Flex gap="sm">
                  <Small className="text-muted-foreground w-32">Completed:</Small>
                  <Small>{format(new Date(webhook.completed_at), 'MMM dd, yyyy HH:mm:ss')}</Small>
                </Flex>
              )}

              {webhook.next_retry_at && (
                <Flex gap="sm">
                  <Small className="text-muted-foreground w-32">Next Retry:</Small>
                  <Small>{format(new Date(webhook.next_retry_at), 'MMM dd, yyyy HH:mm:ss')}</Small>
                </Flex>
              )}
            </Stack>
          </Stack>

          <Separator />

          {/* Payload */}
          <Stack gap="sm">
            <H4>Payload</H4>
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-xs">
                <code>{JSON.stringify(webhook.payload, null, 2)}</code>
              </pre>
            </div>
          </Stack>

          {/* Response - would be shown if webhook_queue had response field */}

          {/* Error */}
          {webhook.last_error && (
            <>
              <Separator />
              <Stack gap="sm">
                <H4>Error</H4>
                <Alert variant="destructive">
                  <AlertDescription className="break-words">
                    {webhook.last_error}
                  </AlertDescription>
                </Alert>
              </Stack>
            </>
          )}
        </Stack>

        <DialogFooter>
          <Flex gap="sm" justify="between" className="w-full">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isRetrying}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>

            <Flex gap="sm">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>

              {webhook.status === 'failed' && (
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying || isDeleting}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </Button>
              )}
            </Flex>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
