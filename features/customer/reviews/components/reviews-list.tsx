'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { Star } from 'lucide-react'
import { EditReviewDialog } from './edit-review-dialog'
import { DeleteReviewDialog } from './delete-review-dialog'
import type { ReviewsListProps } from '../types'

function StarRating({ rating }: { rating: number | null }) {
  const validRating = rating ?? 0

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < validRating ? 'text-accent' : 'text-muted-foreground/30'} aria-hidden="true">
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
      <EmptyState
        icon={Star}
        title="No reviews yet"
        description="Share feedback after your next appointment to help others discover great salons."
        action={
          <Button asChild>
            <Link href="/customer/appointments">View upcoming appointments</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid gap-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:space-y-0">
            <div className="space-y-1">
              <CardTitle>Salon review</CardTitle>
              {review.title && <CardDescription>{review.title}</CardDescription>}
            </div>
            <StarRating rating={review.rating} />
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription>{review.comment}</CardDescription>

            {(review.service_quality_rating || review.cleanliness_rating || review.value_rating) && (
              <div className="grid gap-4 sm:grid-cols-3">
                {review.service_quality_rating && (
                  <div className="space-y-1">
                    <p className="uppercase text-sm text-muted-foreground">Service</p>
                    <StarRating rating={review.service_quality_rating} />
                  </div>
                )}
                {review.cleanliness_rating && (
                  <div className="space-y-1">
                    <p className="uppercase text-sm text-muted-foreground">Cleanliness</p>
                    <StarRating rating={review.cleanliness_rating} />
                  </div>
                )}
                {review.value_rating && (
                  <div className="space-y-1">
                    <p className="uppercase text-sm text-muted-foreground">Value</p>
                    <StarRating rating={review.value_rating} />
                  </div>
                )}
              </div>
            )}

            <CardDescription>
              {review.created_at &&
                new Date(review.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row">
            <EditReviewDialog review={review} />
            <DeleteReviewDialog review={review} />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
