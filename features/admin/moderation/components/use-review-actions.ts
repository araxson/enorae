'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { flagReview, unflagReview, deleteReview, featureReview } from '../api/mutations'
import type { ReviewActions } from './reviews-table.types'

export function useReviewActions(): ReviewActions {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const withLoading = async (id: string, action: () => Promise<void | { error?: string }>) => {
    setLoadingId(id)
    try {
      const result = await action()
      return result
    } finally {
      setLoadingId(null)
    }
  }

  const flag = (reviewId: string) =>
    withLoading(reviewId, async () => {
      const reason = prompt('Enter reason for flagging this review:')
      if (!reason) return

      const formData = new FormData()
      formData.append('reviewId', reviewId)
      formData.append('reason', reason)

      const result = await flagReview(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('The review has been flagged for moderation.')
      }
    })

  const unflag = (reviewId: string) =>
    withLoading(reviewId, async () => {
      const formData = new FormData()
      formData.append('reviewId', reviewId)

      const result = await unflagReview(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('The flag has been removed from this review.')
      }
    })

  const toggleFeature = (reviewId: string, isFeatured: boolean) =>
    withLoading(reviewId, async () => {
      const formData = new FormData()
      formData.append('reviewId', reviewId)
      formData.append('isFeatured', (!isFeatured).toString())

      const result = await featureReview(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(isFeatured ? 'The review is no longer featured.' : 'The review has been featured.')
      }
    })

  const remove = (reviewId: string) =>
    withLoading(reviewId, async () => {
      if (!confirm('Are you sure you want to delete this review?')) return

      const formData = new FormData()
      formData.append('reviewId', reviewId)

      const result = await deleteReview(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('The review has been deleted.')
      }
    })

  return {
    loadingId,
    flag,
    unflag,
    toggleFeature,
    remove,
  }
}
