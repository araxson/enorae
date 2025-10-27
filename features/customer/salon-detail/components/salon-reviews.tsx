'use client'

import { useState } from 'react'
import { ThumbsUp, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { markReviewAsHelpful } from '@/features/customer/reviews/api/helpful-mutations'
import type { Database } from '@/lib/types/database.types'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

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
            i < validRating ? 'fill-accent text-accent' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: SalonReview }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review['helpful_count'] || 0)
  const reviewDate =
    review['created_at'] &&
    new Date(review['created_at']).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const handleMarkHelpful = async () => {
    if (!review['id']) return

    setIsSubmitting(true)
    const result = await markReviewAsHelpful(review['id'])

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
      <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <StarRating rating={review['rating']} />
          {review['is_verified'] && <Badge variant="secondary">Verified</Badge>}
        </div>
        {reviewDate && <CardDescription>{reviewDate}</CardDescription>}
      </CardHeader>
      <CardContent>
        <CardDescription>{review['comment']}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={handleMarkHelpful} disabled={isSubmitting}>
          <ThumbsUp className="mr-2 h-4 w-4" />
          Helpful {helpfulCount > 0 && `(${helpfulCount})`}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function SalonReviews({ reviews }: SalonReviewsProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyMedia variant="icon">
              <Star className="h-6 w-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No reviews yet</EmptyTitle>
              <EmptyDescription>Be the first to leave a review for this salon.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              Reviews from verified customers will appear here once submitted.
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + (r['rating'] || 0), 0) / reviews.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Customer reviews ({reviews.length})</CardTitle>
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(avgRating)} />
              <CardDescription>{avgRating.toFixed(1)} average</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Feedback from recent salon visits helps other customers choose with confidence.
          </CardDescription>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review['id']} review={review} />
        ))}
      </div>
    </div>
  )
}
