'use client'

import { memo, useCallback } from 'react'
import { Item, ItemHeader } from '@/components/ui/item'
import type { NormalizedReview } from './use-reviews-list'
import { ReviewCardHeader } from './review-card-header'
import { ReviewCardActions } from './review-card-actions'
import { ReviewCardContent } from './review-card-content'

type ReviewCardProps = {
  review: NormalizedReview
  onRespond: (review: NormalizedReview) => void
  onFlag: (reviewId: string) => void
  onToggleFeatured: (reviewId: string, featured: boolean) => Promise<void>
}

const STAR_INDICES = [0, 1, 2, 3, 4]

function ReviewCardComponent({ review, onRespond, onFlag, onToggleFeatured }: ReviewCardProps) {
  const renderStars = useCallback((rating: number | null) => {
    const stars = rating || 0
    return (
      <div className="flex gap-1" role="img" aria-label={`${stars} out of 5 stars`}>
        {STAR_INDICES.map((index) => (
          <StarIcon key={index} filled={index < stars} />
        ))}
      </div>
    )
  }, [])

  const formatDate = useCallback((date: string | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [])

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex w-full items-start justify-between gap-4">
          <ReviewCardHeader
            customerName={review.customer_name ?? null}
            isVerified={review.is_verified}
            isFeatured={review.is_featured}
            isFlagged={review.is_flagged}
            rating={review.rating}
            createdAt={review.created_at}
            renderStars={renderStars}
            formatDate={formatDate}
          />
          <ReviewCardActions
            review={review}
            onRespond={onRespond}
            onFlag={onFlag}
            onToggleFeatured={onToggleFeatured}
          />
        </div>
      </ItemHeader>

      <ReviewCardContent
        title={review.title}
        comment={review.comment}
        serviceQualityRating={review.service_quality_rating}
        cleanlinessRating={review.cleanliness_rating}
        valueRating={review.value_rating}
        response={review.response}
        respondedByName={review.responded_by_name ?? null}
        responseDate={review.response_date}
        formatDate={formatDate}
      />
    </Item>
  )
}

export const ReviewCard = memo(ReviewCardComponent)

interface StarIconProps {
  filled: boolean
}

const StarIcon = memo(function StarIcon({ filled }: StarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-4 ${filled ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
})
