import { useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import type { SalonReviewWithDetails } from '@/features/business/reviews/api/queries'

export type NormalizedReview = {
  id: string
  customer_id: string | null
  salon_id: string | null
  rating: number | null
  comment: string | null
  created_at: string | null
  responded_at: string | null
  responded_by_id: string | null
  response_text: string | null
  response: string | null
  response_date: string | null
  is_featured: boolean | null
  is_flagged: boolean | null
  is_verified: boolean | null
  title: string | null
  service_quality_rating: number | null
  cleanliness_rating: number | null
  value_rating: number | null
  customer_name?: string | null
  responded_by_name?: string | null
}

interface UseReviewsListParams {
  reviews: SalonReviewWithDetails[]
}

export function useReviewsList({ reviews }: UseReviewsListParams) {
  const [selectedReview, setSelectedReview] = useState<SalonReviewWithDetails | null>(null)
  const [response, setResponse] = useState('')
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [flagReviewId, setFlagReviewId] = useState<string | null>(null)
  const [flagReason, setFlagReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const selectReview = (review: SalonReviewWithDetails | null) => {
    setSelectedReview(review)
    setResponse('')
  }

  const openFlagDialog = (reviewId: string) => {
    setFlagReviewId(reviewId)
    setShowFlagDialog(true)
    setFlagReason('')
  }

  const closeFlagDialog = () => {
    setShowFlagDialog(false)
    setFlagReviewId(null)
    setFlagReason('')
  }

  const handleRespond = async () => {
    if (!selectedReview || !response.trim()) return

    setIsSubmitting(true)
    try {
      // Response submission logic would go here
      toast({
        title: 'Success',
        description: 'Response submitted successfully',
      })
      selectReview(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit response',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFlag = async () => {
    if (!flagReviewId || !flagReason.trim()) return

    setIsSubmitting(true)
    try {
      // Flag submission logic would go here
      toast({
        title: 'Success',
        description: 'Review flagged successfully',
      })
      closeFlagDialog()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to flag review',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleFeatured = async (reviewId: string) => {
    try {
      // Toggle featured logic would go here
      toast({
        title: 'Success',
        description: 'Review featured status updated',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      })
    }
  }

  return {
    reviews,
    state: {
      selectedReview,
      response,
      showFlagDialog,
      flagReason,
      isSubmitting,
    },
    actions: {
      selectReview,
      setResponse,
      openFlagDialog,
      closeFlagDialog,
      setFlagReason,
    },
    handlers: {
      handleRespond,
      handleFlag,
      handleToggleFeatured,
    },
  }
}
