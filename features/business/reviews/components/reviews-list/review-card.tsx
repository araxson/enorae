'use client'

import { memo, useCallback, useMemo } from 'react'
import { CheckCircle2, Flag, MessageSquare, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { NormalizedReview } from './use-reviews-list'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

type ReviewCardProps = {
  review: NormalizedReview
  onRespond: (review: NormalizedReview) => void
  onFlag: (reviewId: string) => void
  onToggleFeatured: (reviewId: string, featured: boolean) => Promise<void>
}

// PERFORMANCE: Memoize star array to prevent re-creation on every render
const STAR_INDICES = [0, 1, 2, 3, 4]

// PERFORMANCE: Wrap in React.memo to prevent re-renders in list views
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

  // PERFORMANCE: Wrap handlers in useCallback
  const handleRespond = useCallback(() => {
    onRespond(review)
  }, [onRespond, review])

  const handleFlag = useCallback(() => {
    onFlag(review.id)
  }, [onFlag, review.id])

  const handleToggleFeatured = useCallback(async () => {
    await onToggleFeatured(review.id, !review.is_featured)
    toast.success(!review.is_featured ? 'Review featured' : 'Review unfeatured')
  }, [onToggleFeatured, review.id, review.is_featured])

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <ItemTitle>{review.customer_name || 'Anonymous'}</ItemTitle>
              {review.is_verified && (
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle2 className="size-3" aria-hidden="true" />
                  <Badge variant="outline">Verified</Badge>
                </div>
              )}
              {review.is_featured && (
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="size-3" aria-hidden="true" />
                  <Badge variant="default">Featured</Badge>
                </div>
              )}
              {review.is_flagged && (
                <div className="flex items-center gap-1 text-xs">
                  <Flag className="size-3" aria-hidden="true" />
                  <Badge variant="destructive">Flagged</Badge>
                </div>
              )}
            </div>
            <Field>
              <FieldContent className="flex items-center gap-4">
                {renderStars(review.rating)}
                <FieldDescription>{formatDate(review.created_at)}</FieldDescription>
              </FieldContent>
            </Field>
          </div>

          <ItemActions>
            <ButtonGroup>
              {!review.response ? (
                <Button size="sm" variant="outline" onClick={handleRespond}>
                  <MessageSquare className="mr-2 size-4" aria-hidden="true" />
                  Respond
                </Button>
              ) : null}
              {!review.is_flagged ? (
                <Button size="sm" variant="ghost" onClick={handleFlag} aria-label="Flag review for moderation">
                  <Flag className="size-4" aria-hidden="true" />
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleToggleFeatured}
                aria-label={review.is_featured ? 'Unfeature review' : 'Feature review'}
              >
                <TrendingUp className={`size-4 ${review.is_featured ? 'fill-current' : ''}`} aria-hidden="true" />
              </Button>
            </ButtonGroup>
          </ItemActions>
        </div>
      </ItemHeader>

      <ItemContent>
        <div className="flex flex-col gap-4">
          {review.title ? <p className="font-medium leading-7">{review.title}</p> : null}
          {review.comment ? <p className="text-sm leading-7">{review.comment}</p> : null}

          {(review.service_quality_rating || review.cleanliness_rating || review.value_rating) ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {review.service_quality_rating ? (
                <RatingItem label="Service Quality" rating={review.service_quality_rating} />
              ) : null}
              {review.cleanliness_rating ? (
                <RatingItem label="Cleanliness" rating={review.cleanliness_rating} />
              ) : null}
              {review.value_rating ? <RatingItem label="Value" rating={review.value_rating} /> : null}
            </div>
          ) : null}

          {review.response ? (
            <ItemGroup>
              <Item variant="muted" className="flex-col gap-3">
                <ItemHeader>
                  <div className="flex w-full items-center justify-between gap-4">
                    <div>
                      <ItemTitle>Response from salon</ItemTitle>
                      {review.responded_by_name ? (
                        <ItemDescription>By {review.responded_by_name}</ItemDescription>
                      ) : null}
                    </div>
                    <ItemDescription>{formatDate(review.response_date)}</ItemDescription>
                  </div>
                </ItemHeader>
                <ItemContent>
                  <ItemDescription>{review.response}</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          ) : null}
        </div>
      </ItemContent>
    </Item>
  )
}

// PERFORMANCE: Export memoized version
export const ReviewCard = memo(ReviewCardComponent)

type RatingItemProps = {
  label: string
  rating: number | null
}

// PERFORMANCE: Memoize RatingItem to prevent re-renders
const RatingItem = memo(function RatingItem({ label, rating }: RatingItemProps) {
  const stars = rating || 0
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <div className="flex gap-1" role="img" aria-label={`${label}: ${stars} out of 5 stars`}>
          {STAR_INDICES.map((index) => (
            <StarIcon key={index} filled={index < stars} />
          ))}
        </div>
      </FieldContent>
    </Field>
  )
})

type StarIconProps = {
  filled: boolean
}

// PERFORMANCE: Memoize StarIcon as it's rendered multiple times per review
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
