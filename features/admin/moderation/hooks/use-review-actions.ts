'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { flagReview, unflagReview, deleteReview, featureReview } from '@/features/admin/moderation/api/mutations'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'

export type ActionType = 'flag' | 'unflag' | 'feature' | 'delete' | null

export type DialogState = {
  type: ActionType
  review?: ModerationReview
}

export function useReviewActions() {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ type: null })
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | null>(null)

  const requiresReason = dialog.type === 'flag' || dialog.type === 'delete'

  const openDialog = (type: ActionType, review: ModerationReview) => {
    setDialog({ type, review })
    setReason('')
    setReasonError(null)
  }

  const closeDialog = () => {
    setDialog({ type: null })
    setReason('')
    setReasonError(null)
  }

  const handleAction = async () => {
    if (!dialog.review || !dialog.review.id) return

    if (requiresReason) {
      if (reason.trim().length < 10) {
        setReasonError('Please provide a reason with at least 10 characters.')
        return
      }
    }

    const reviewId = dialog.review.id
    setLoadingId(reviewId)

    try {
      const formData = new FormData()
      formData.append('reviewId', reviewId)

      switch (dialog.type) {
        case 'flag': {
          formData.append('reason', reason.trim())
          const result = await flagReview(formData)
          if (result?.error) throw new Error(result.error)
          toast.success('The review has been flagged for moderation.')
          break
        }
        case 'unflag': {
          const result = await unflagReview(formData)
          if (result?.error) throw new Error(result.error)
          toast.success('The flag has been removed from this review.')
          break
        }
        case 'feature': {
          const nextValue = !(dialog.review.is_featured ?? false)
          formData.append('isFeatured', nextValue.toString())
          const result = await featureReview(formData)
          if (result?.error) throw new Error(result.error)
          toast.success(nextValue ? 'The review has been featured.' : 'The review is no longer featured.')
          break
        }
        case 'delete': {
          formData.append('reason', reason.trim())
          const result = await deleteReview(formData)
          if (result?.error) throw new Error(result.error)
          toast.success('The review has been deleted.')
          break
        }
        default:
          break
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed'
      toast.error(message)
      return
    } finally {
      setLoadingId(null)
      closeDialog()
    }
  }

  return {
    loadingId,
    dialog,
    reason,
    reasonError,
    requiresReason,
    openDialog,
    closeDialog,
    handleAction,
    setReason,
    setReasonError,
  }
}
