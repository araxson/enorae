'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Database } from '@/lib/types/database.types'
import { retryWebhook, deleteWebhook } from '@/features/business/webhooks/api/mutations'
import { WebhookStatusSection } from './webhook-status-section'
import { WebhookPayloadSection } from './webhook-payload-section'
import { WebhookErrorSection } from './webhook-error-section'
import { WebhookActionButtons } from './webhook-detail-actions'
import { Separator } from '@/components/ui/separator'

type WebhookQueue = Database['public']['Views']['communication_webhook_queue']['Row']

type WebhookDetailDialogProps = {
  webhook: WebhookQueue | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WebhookDetailDialog({ webhook, open, onOpenChange }: WebhookDetailDialogProps) {
  const router = useRouter()
  const [isRetrying, setIsRetrying] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!webhook) return null

  const resetAlerts = () => {
    setError(null)
    setSuccess(null)
  }

  const handleRetry = async () => {
    if (!webhook.id) return
    setIsRetrying(true)
    resetAlerts()

    const result = await retryWebhook(webhook.id)

    if (result.success) {
      setSuccess('Webhook queued for retry')
      toast.success('Webhook queued for retry')
      onOpenChange(false)
      router.refresh()
    } else if (result.error) {
      setError(result.error)
      toast.error(result.error)
    }

    setIsRetrying(false)
  }

  const handleDelete = async () => {
    if (isDeleting || !webhook.id) return

    setIsDeleting(true)
    resetAlerts()

    const result = await deleteWebhook(webhook.id)

    if (result.success) {
      setSuccess('Webhook deleted successfully')
      toast.success('Webhook deleted successfully')
      onOpenChange(false)
      router.refresh()
    } else if (result.error) {
      setError(result.error)
      toast.error(result.error)
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

        <div className="flex flex-col gap-6">
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

          <WebhookStatusSection webhook={webhook} />

          <Separator />

          <WebhookPayloadSection payload={webhook.payload} />

          {webhook.last_error && (
            <>
              <Separator />
              <WebhookErrorSection error={webhook.last_error || 'None'} />
            </>
          )}
        </div>

        <DialogFooter>
          <WebhookActionButtons
            onClose={() => onOpenChange(false)}
            onRetry={handleRetry}
            onDelete={handleDelete}
            status={webhook.status || 'pending'}
            isRetrying={isRetrying}
            isDeleting={isDeleting}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
