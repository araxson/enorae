import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import type { DialogState, ActionType } from '../../hooks/use-review-actions'

type ActionDialogProps = {
  dialog: DialogState
  reason: string
  reasonError: string | null
  requiresReason: boolean
  loadingId: string | null
  onClose: () => void
  onConfirm: () => void
  onReasonChange: (value: string) => void
  onReasonErrorClear: () => void
}

function getDialogContent(dialog: DialogState) {
  if (!dialog.review || !dialog.type) return null

  const reviewLabel = dialog.review.customer_name || dialog.review.customer_email || 'Review'

  const titles: Record<NonNullable<ActionType>, string> = {
    flag: 'Flag Review',
    unflag: 'Remove Flag from Review',
    feature: dialog.review.is_featured ? 'Unfeature Review' : 'Feature Review',
    delete: 'Delete Review',
  }

  const descriptions: Record<NonNullable<ActionType>, string> = {
    flag: 'Flagging will move the review into the moderation queue for additional review.',
    unflag: 'This will remove the moderation flag and return the review to normal visibility.',
    feature: dialog.review.is_featured
      ? 'This will remove the review from featured placements.'
      : 'Featuring will highlight this review across the platform.',
    delete: 'This will permanently delete the review and cannot be undone.',
  }

  return { title: titles[dialog.type], description: descriptions[dialog.type], reviewLabel }
}

export function ActionDialog({
  dialog,
  reason,
  reasonError,
  requiresReason,
  loadingId,
  onClose,
  onConfirm,
  onReasonChange,
  onReasonErrorClear,
}: ActionDialogProps) {
  const dialogContent = getDialogContent(dialog)

  return (
    <AlertDialog open={dialog.type !== null} onOpenChange={(open) => (open ? void 0 : onClose())}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogContent?.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialogContent?.description}</AlertDialogDescription>
          <AlertDialogDescription>Review by: {dialogContent?.reviewLabel}</AlertDialogDescription>
        </AlertDialogHeader>

        {requiresReason ? (
          <Field data-invalid={Boolean(reasonError)}>
            <FieldLabel htmlFor="moderation-reason">Reason (required)</FieldLabel>
            <FieldContent>
              <Textarea
                id="moderation-reason"
                value={reason}
                onChange={(event) => {
                  onReasonChange(event.target.value)
                  onReasonErrorClear()
                }}
                placeholder="Provide context for this action"
                aria-invalid={Boolean(reasonError)}
                autoFocus
                rows={4}
              />
              <FieldDescription>Required for audit logging and reviewer visibility.</FieldDescription>
            </FieldContent>
            {reasonError ? <FieldError>{reasonError}</FieldError> : null}
          </Field>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loadingId !== null}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loadingId !== null}>
            {loadingId !== null ? (
              <>
                <Spinner className="mr-2 size-4" />
                <span>Processing…</span>
              </>
            ) : (
              <span>Confirm</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
