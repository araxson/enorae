import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { RefreshCw, Trash2 } from 'lucide-react'

type WebhookActionProps = {
  onClose: () => void
  onRetry: () => void
  onDelete: () => void
  status: string
  isRetrying: boolean
  isDeleting: boolean
}

export function WebhookActionButtons({
  onClose,
  onRetry,
  onDelete,
  status,
  isRetrying,
  isDeleting,
}: WebhookActionProps) {
  return (
    <div className="flex gap-3 justify-between w-full">
      <ConfirmDialog
        title="Delete Webhook Entry?"
        description="This will permanently remove the webhook record."
        confirmText="Delete"
        onConfirm={onDelete}
      >
        <Button variant="destructive" disabled={isDeleting || isRetrying}>
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </ConfirmDialog>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>

        {status === 'failed' && (
          <Button onClick={onRetry} disabled={isRetrying || isDeleting}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {isRetrying ? 'Retrying...' : 'Retry'}
          </Button>
        )}
      </div>
    </div>
  )
}
