'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Stack, Grid, Flex } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
import type { Database } from '@/lib/types/database.types'

type Review = Database['public']['Views']['salon_reviews_view']['Row']

interface ReviewsListProps {
  reviews: Review[]
}

function StarRating({ rating }: { rating: number | null }) {
  const validRating = rating || 0
  return (
    <Flex gap="xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < validRating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </Flex>
  )
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Stack gap="md">
          <H3>No reviews yet</H3>
          <Muted>Leave a review after your next appointment</Muted>
        </Stack>
      </Card>
    )
  }

  return (
    <Grid cols={{ base: 1 }} gap="lg">
      {reviews.map((review) => (
        <Card key={review.id} className="p-6">
          <Stack gap="md">
            <Flex justify="between" align="start">
              <div>
                <H3>Salon Review</H3>
                {review.title && <P className="text-sm font-medium">{review.title}</P>}
              </div>
              <StarRating rating={review.rating} />
            </Flex>

            <P className="text-sm">{review.comment}</P>

            {(review.service_quality_rating || review.cleanliness_rating || review.value_rating) && (
              <div className="grid grid-cols-3 gap-4 text-sm">
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

            <Muted className="text-xs">
              {review.created_at && new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Muted>

            <Flex gap="sm">
              <Button variant="outline" size="sm" className="flex-1">
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                Delete
              </Button>
            </Flex>
          </Stack>
        </Card>
      ))}
    </Grid>
  )
}
