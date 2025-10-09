'use client'

import { Card, CardContent } from '@/components/ui/card'
import { H3, P, Muted } from '@/components/ui/typography'
import { EditReviewDialog } from './edit-review-dialog'
import { DeleteReviewDialog } from './delete-review-dialog'
import type { Database } from '@/lib/types/database.types'

type Review = Database['public']['Views']['salon_reviews_view']['Row']

interface ReviewsListProps {
  reviews: Review[]
}

function StarRating({ rating }: { rating: number | null }) {
  const validRating = rating ?? 0

  return (
    <div className="flex items-center gap-1 text-sm">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={index < validRating ? 'text-yellow-500' : 'text-muted-foreground/30'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="sr-only">{validRating} out of 5</span>
    </div>
  )
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="space-y-3 py-12 text-center">
            <H3>No reviews yet</H3>
            <Muted>Leave a review after your next appointment.</Muted>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <H3>Salon review</H3>
                {review.title && <P className="text-sm font-medium">{review.title}</P>}
              </div>
              <StarRating rating={review.rating} />
            </div>

            <P className="text-sm text-muted-foreground">{review.comment}</P>

            {(review.service_quality_rating || review.cleanliness_rating || review.value_rating) && (
              <div className="grid gap-4 text-sm sm:grid-cols-3">
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

            <Muted className="text-xs text-muted-foreground">
              {review.created_at &&
                new Date(review.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </Muted>

            <div className="flex flex-col gap-2 sm:flex-row">
              <EditReviewDialog review={review} />
              <DeleteReviewDialog review={review} />
            </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
