'use client'

import { useState } from 'react'

import { respondToReview, flagReview, toggleFeaturedReview } from '@/features/business/reviews/api/mutations'
import type { SalonReviewWithDetails } from '@/features/business/reviews/api/queries'

export type NormalizedReview = SalonReviewWithDetails & { id: string }

export type ReviewsListHookResult = {
  reviews: NormalizedReview[]
  state: {
    selectedReview: NormalizedReview | null
    response: string
    isSubmitting: boolean
    flagReason: string
    showFlagDialog: boolean
  }
  actions: {
    selectReview: (review: NormalizedReview | null) => void
    setResponse: (value: string) => void
    openFlagDialog: (reviewId: string) => void
    closeFlagDialog: () => void
    setFlagReason: (value: string) => void
  }
  handlers: {
    handleRespond: () => Promise<void>
    handleFlag: () => Promise<void>
    handleToggleFeatured: (reviewId: string, featured: boolean) => Promise<void>
  }
}

type UseReviewsListParams = {
  reviews: SalonReviewWithDetails[]
}

export function useReviewsList({ reviews }: UseReviewsListParams): ReviewsListHookResult {
  const normalizedReviews = reviews
    .filter((review): review is NormalizedReview => Boolean(review.id))
    .map((review) => ({ ...review, id: review.id! }))

  const [selectedReview, setSelectedReview] = useState<NormalizedReview | null>(null)
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [flaggingReview, setFlaggingReview] = useState<string | null>(null)

  const handleRespond = async () => {
    if (!selectedReview?.id || !response.trim()) return

    setIsSubmitting(true)
    const result = await respondToReview(selectedReview.id, response.trim())
    setIsSubmitting(false)

    if (result.success) {
      setSelectedReview(null)
      setResponse('')
    }
  }

  const handleFlag = async () => {
    if (!flaggingReview || !flagReason.trim()) return

    setIsSubmitting(true)
    const result = await flagReview(flaggingReview, flagReason.trim())
    setIsSubmitting(false)

    if (result.success) {
      setShowFlagDialog(false)
      setFlaggingReview(null)
      setFlagReason('')
    }
  }

  const handleToggleFeatured = async (reviewId: string, featured: boolean) => {
    await toggleFeaturedReview(reviewId, featured)
  }

  return {
    reviews: normalizedReviews,
    state: {
      selectedReview,
      response,
      isSubmitting,
      flagReason,
      showFlagDialog,
    },
    actions: {
      selectReview: (review) => {
        setSelectedReview(review)
        setResponse(review?.response ?? '')
      },
      setResponse,
      openFlagDialog: (reviewId) => {
        setFlaggingReview(reviewId)
        setShowFlagDialog(true)
      },
      closeFlagDialog: () => {
        setShowFlagDialog(false)
        setFlaggingReview(null)
        setFlagReason('')
      },
      setFlagReason,
    },
    handlers: {
      handleRespond,
      handleFlag,
      handleToggleFeatured,
    },
  }
}
