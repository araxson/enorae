'use client'

import { memo, useCallback, useMemo } from 'react'
import { CheckCircle2, Flag, MessageSquare, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { NormalizedReview } from './use-reviews-list'

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
    <Card>
      <CardHeader>
        <div className="flex gap-4 items-start justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center">
              <div className="text-base font-semibold">{review.customer_name || 'Anonymous'}</div>
              {review.is_verified && (
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  <Badge variant="outline">Verified</Badge>
                </div>
              )}
              {review.is_featured && (
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <Badge variant="default">Featured</Badge>
                </div>
              )}
              {review.is_flagged && (
                <div className="flex items-center gap-1 text-xs">
                  <Flag className="h-3 w-3" />
                  <Badge variant="destructive">Flagged</Badge>
                </div>
              )}
            </div>
            <div className="flex gap-4 items-center">
              {renderStars(review.rating)}
              <p className="text-sm font-medium text-muted-foreground">{formatDate(review.created_at)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {!review.response && (
              <Button size="sm" variant="outline" onClick={handleRespond}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Respond
              </Button>
            )}
            {!review.is_flagged && (
              <Button size="sm" variant="ghost" onClick={handleFlag} aria-label="Flag review for moderation">
                <Flag className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleFeatured}
              aria-label={review.is_featured ? 'Unfeature review' : 'Feature review'}
            >
              <TrendingUp className={`h-4 w-4 ${review.is_featured ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {review.title && <p className="leading-7 font-medium">{review.title}</p>}
          {review.comment && <p className="leading-7 text-sm">{review.comment}</p>}

          {(review.service_quality_rating || review.cleanliness_rating || review.value_rating) && (
            <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
              {review.service_quality_rating && (
                <RatingItem label="Service Quality" rating={review.service_quality_rating} />
              )}
              {review.cleanliness_rating && (
                <RatingItem label="Cleanliness" rating={review.cleanliness_rating} />
              )}
              {review.value_rating && <RatingItem label="Value" rating={review.value_rating} />}
            </div>
          )}

          {review.response && (
            <Card>
              <CardHeader>
                <div className="flex gap-4 items-center justify-between">
                  <div>
                    <CardTitle>Response from salon</CardTitle>
                    {review.responded_by_name ? (
                      <CardDescription>By {review.responded_by_name}</CardDescription>
                    ) : null}
                  </div>
                  <CardDescription>{formatDate(review.response_date)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-sm">{review.response}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
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
    <div>
      <p className="text-sm text-muted-foreground text-xs">{label}</p>
      <div className="flex gap-1" role="img" aria-label={`${label}: ${stars} out of 5 stars`}>
        {STAR_INDICES.map((index) => (
          <StarIcon key={index} filled={index < stars} />
        ))}
      </div>
    </div>
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
      className={`h-4 w-4 ${filled ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
})
