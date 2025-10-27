'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { EditReviewDialog } from './edit-review-dialog'
import { DeleteReviewDialog } from './delete-review-dialog'
import type { ReviewsListProps } from '@/features/customer/reviews/types'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

function StarRating({ rating }: { rating: number | null }) {
  const validRating = rating ?? 0

  return (
    <Badge variant="secondary" className="gap-1">
      <Star className="h-3 w-3 fill-accent text-accent" aria-hidden="true" />
      <span>{validRating} / 5</span>
      <span className="sr-only">{validRating} out of 5 stars</span>
    </Badge>
  )
}

export function ReviewsList({ reviews }: ReviewsListProps) {
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
              <EmptyDescription>
                Share feedback after your next appointment to help others discover great salons.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/customer/appointments">View upcoming appointments</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {reviews.map((review) => (
        <Card key={review['id']}>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="space-y-1">
                <CardTitle>Salon review</CardTitle>
                {review['salon_name'] && <CardDescription>{review['salon_name']}</CardDescription>}
              </div>
              <StarRating rating={review['rating']} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CardDescription>{review['comment']}</CardDescription>
              {review['created_at'] ? (
                <CardDescription>
                  <time dateTime={review['created_at']}>
                    {new Date(review['created_at']).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </CardDescription>
              ) : null}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col gap-2 sm:flex-row">
              <EditReviewDialog review={review} />
              <DeleteReviewDialog review={review} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
