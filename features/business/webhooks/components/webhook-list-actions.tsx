'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { retryAllFailedWebhooks, clearCompletedWebhooks } from '@/features/business/webhooks/api/mutations'
import { ConfirmDialog } from '@/features/shared/ui'

interface WebhookListActionsProps {
  failedCount: number
  completedCount: number
}

export function WebhookListActions({ failedCount, completedCount }: WebhookListActionsProps) {
  const router = useRouter()
  const [isRetryingAll, setIsRetryingAll] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

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

  return (
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
  )
}
