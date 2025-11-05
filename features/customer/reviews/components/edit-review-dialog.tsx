'use client'

import { useState, useActionState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Pencil } from 'lucide-react'
import { updateReview } from '@/features/customer/reviews/api/mutations'
import type { Review } from '@/features/customer/reviews/api/types'
import { Spinner } from '@/components/ui/spinner'
import { ButtonGroup } from '@/components/ui/button-group'
import { EditReviewForm } from './edit-review-form'
import { EditWindowAlert } from './edit-window-alert'

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24
const REVIEW_EDIT_WINDOW_DAYS = 7
const DEFAULT_DAYS_SINCE_FALLBACK = 999

interface EditReviewDialogProps {
  review: Review
  children?: React.ReactNode
}

export function EditReviewDialog({ review, children }: EditReviewDialogProps) {
  const [open, setOpen] = useState(false)

  const daysSince = review['created_at']
    ? (Date.now() - new Date(review['created_at']).getTime()) / MILLISECONDS_PER_DAY
    : DEFAULT_DAYS_SINCE_FALLBACK
  const canEdit = daysSince <= REVIEW_EDIT_WINDOW_DAYS

  // Server Action wrapper for useActionState
  type ReviewFormState = { success: boolean; error: string | null }

  const updateReviewAction = async (prevState: ReviewFormState, formData: FormData): Promise<ReviewFormState> => {
    const result = await updateReview(review?.['id'] || '', formData)

    if (result.success) {
      setOpen(false)
      return { success: true, error: null }
    }

    return { success: false, error: result.error || 'Failed to update review' }
  }

  const [state, formAction, isPending] = useActionState(updateReviewAction, { success: false, error: null })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit review</DialogTitle>
          <DialogDescription>
            {canEdit
              ? `Update your review. You can edit this review within ${REVIEW_EDIT_WINDOW_DAYS} days of posting (${Math.ceil(REVIEW_EDIT_WINDOW_DAYS - daysSince)} days remaining).`
              : `This review can no longer be edited (${REVIEW_EDIT_WINDOW_DAYS}-day window expired).`}
          </DialogDescription>
        </DialogHeader>

        {!canEdit ? (
          <EditWindowAlert daysSince={daysSince} />
        ) : (
          <form action={formAction} className="space-y-4" noValidate>
            <EditReviewForm
              reviewId={review['id'] || ''}
              salonId={review['salon_id'] || ''}
              defaultComment={review['comment']}
              defaultRating={review['rating']}
            />

            {state?.error && (
              <Alert variant="destructive" role="alert">
                <AlertCircle className="size-4" />
                <AlertTitle>Update failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <ButtonGroup aria-label="Dialog actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} aria-busy={isPending}>
                  {isPending ? (
                    <>
                      <Spinner className="size-4" />
                      <span>Updating</span>
                    </>
                  ) : (
                    <span>Update review</span>
                  )}
                </Button>
              </ButtonGroup>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
