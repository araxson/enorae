'use client'

import { useState } from 'react'
import { ThumbsUp, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex, Grid } from '@/components/layout'
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
    <Flex gap="xs" align="center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < validRating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
          }`}
        />
      ))}
    </Flex>
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
      <CardContent className="pt-6">
        <Stack gap="md">
          <Flex justify="between" align="start">
            <div>
              <Flex gap="sm" align="center">
                <StarRating rating={review.rating} />
                {review.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </Flex>
              {review.title && <P className="font-medium mt-2">{review.title}</P>}
            </div>
          </Flex>

          <P className="text-sm">{review.comment}</P>

          {(review.service_quality_rating ||
            review.cleanliness_rating ||
            review.value_rating) && (
            <div className="grid grid-cols-3 gap-4 py-2 border-t">
              {review.service_quality_rating && (
                <div>
                  <Muted className="text-xs">Service</Muted>
                  <StarRating rating={review.service_quality_rating} />
                </div>
              )}
              {review.cleanliness_rating && (
                <div>
                  <Muted className="text-xs">Cleanliness</Muted>
                  <StarRating rating={review.cleanliness_rating} />
                </div>
              )}
              {review.value_rating && (
                <div>
                  <Muted className="text-xs">Value</Muted>
                  <StarRating rating={review.value_rating} />
                </div>
              )}
            </div>
          )}

          {review.response && (
            <div className="bg-secondary/20 rounded-lg p-4">
              <Muted className="text-xs font-semibold">Response from salon</Muted>
              <P className="text-sm mt-2">{review.response}</P>
              {review.response_date && (
                <Muted className="text-xs mt-2">
                  {new Date(review.response_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Muted>
              )}
            </div>
          )}

          <Flex justify="between" align="center" className="pt-2 border-t">
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
          </Flex>
        </Stack>
      </CardContent>
    </Card>
  )
}

export function SalonReviews({ reviews }: Omit<SalonReviewsProps, 'salonId'>) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Stack gap="md">
            <H3>No reviews yet</H3>
            <Muted>Be the first to leave a review for this salon</Muted>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  // Calculate average rating
  const avgRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length

  return (
    <Stack gap="lg">
      <Card>
        <CardHeader>
          <Flex justify="between" align="center">
            <CardTitle>Customer Reviews ({reviews.length})</CardTitle>
            <Flex gap="sm" align="center">
              <StarRating rating={Math.round(avgRating)} />
              <Muted className="text-sm">{avgRating.toFixed(1)} average</Muted>
            </Flex>
          </Flex>
        </CardHeader>
      </Card>

      <Grid cols={{ base: 1 }} gap="lg">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Grid>
    </Stack>
  )
}
