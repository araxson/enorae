'use client'

import { useState } from 'react'
import { ThumbsUp, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { H3, P, Muted } from '@/components/ui/typography'
import { toast } from 'sonner'
import { markReviewAsHelpful } from '@/features/customer/reviews/api/helpful-mutations'
import type { Database } from '@/lib/types/database.types'

type SalonReview = Database['public']['Views']['salon_reviews_view']['Row']

interface SalonReviewsProps {
  reviews: SalonReview[]
  salonId: string
}

function StarRating({ rating }: { rating: number | null }) {
  const validRating = rating || 0
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < validRating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: SalonReview }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0)

  const handleMarkHelpful = async () => {
    if (!review.id) return

    setIsSubmitting(true)
    const result = await markReviewAsHelpful(review.id)

    if (result.success) {
      setHelpfulCount((prev) => prev + 1)
      toast.success('Marked as helpful')
    } else {
      toast.error(result.error || 'Failed to mark as helpful')
    }

    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={review.rating} />
              {review.is_verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            {review.title && <P className="text-sm font-medium">{review.title}</P>}
          </div>
        </div>

        <P className="text-sm text-muted-foreground">{review.comment}</P>

        {(review.service_quality_rating ||
          review.cleanliness_rating ||
          review.value_rating) && (
          <div className="grid gap-4 border-t pt-4 text-sm sm:grid-cols-3">
            {review.service_quality_rating && (
              <div className="space-y-1">
                <Muted className="text-xs uppercase tracking-wide text-muted-foreground">
                  Service
                </Muted>
                <StarRating rating={review.service_quality_rating} />
              </div>
            )}
            {review.cleanliness_rating && (
              <div className="space-y-1">
                <Muted className="text-xs uppercase tracking-wide text-muted-foreground">
                  Cleanliness
                </Muted>
                <StarRating rating={review.cleanliness_rating} />
              </div>
            )}
            {review.value_rating && (
              <div className="space-y-1">
                <Muted className="text-xs uppercase tracking-wide text-muted-foreground">
                  Value
                </Muted>
                <StarRating rating={review.value_rating} />
              </div>
            )}
          </div>
        )}

        {review.response && (
          <div className="space-y-2 rounded-lg bg-muted/40 p-4">
            <Muted className="text-xs font-semibold">Response from salon</Muted>
            <P className="text-sm">{review.response}</P>
            {review.response_date && (
              <Muted className="text-xs">
                {new Date(review.response_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Muted>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Muted className="text-xs">
            {review.created_at &&
              new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </Muted>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkHelpful}
            disabled={isSubmitting}
            className="gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">
              Helpful {helpfulCount > 0 && `(${helpfulCount})`}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function SalonReviews({ reviews }: Omit<SalonReviewsProps, 'salonId'>) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-3 p-12 text-center">
          <H3>No reviews yet</H3>
          <Muted>Be the first to leave a review for this salon.</Muted>
        </CardContent>
      </Card>
    )
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Customer reviews ({reviews.length})</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <StarRating rating={Math.round(avgRating)} />
              <span>{avgRating.toFixed(1)} average</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
