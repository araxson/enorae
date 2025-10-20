'use client'

import { useState } from 'react'
import { ThumbsUp, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
            i < validRating ? 'fill-warning text-warning' : 'text-muted-foreground/30'
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
            {review.title && <p className="leading-7 text-sm font-medium">{review.title}</p>}
          </div>
        </div>

        <p className="leading-7 text-sm text-muted-foreground">{review.comment}</p>

        {(review.service_quality_rating ||
          review.cleanliness_rating ||
          review.value_rating) && (
          <div className="grid gap-4 border-t pt-4 text-sm sm:grid-cols-3">
            {review.service_quality_rating && (
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Service
                </span>
                <StarRating rating={review.service_quality_rating} />
              </div>
            )}
            {review.cleanliness_rating && (
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Cleanliness
                </span>
                <StarRating rating={review.cleanliness_rating} />
              </div>
            )}
            {review.value_rating && (
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Value
                </span>
                <StarRating rating={review.value_rating} />
              </div>
            )}
          </div>
        )}

        {review.response && (
          <div className="space-y-2 rounded-lg bg-muted/40 p-4">
            <span className="text-xs font-semibold text-muted-foreground">Response from salon</span>
            <p className="leading-7 text-sm">{review.response}</p>
            {review.response_date && (
              <span className="text-xs text-muted-foreground">
                {new Date(review.response_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-muted-foreground">
            {review.created_at &&
              new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </span>

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

export function SalonReviews({ reviews }: SalonReviewsProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <CardTitle>No reviews yet</CardTitle>
          <CardDescription>Be the first to leave a review for this salon.</CardDescription>
        </CardHeader>
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
