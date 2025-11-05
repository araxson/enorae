'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { EditReviewDialog } from './edit-review-dialog'
import { DeleteReviewDialog } from './delete-review-dialog'
import type { ReviewsListProps } from '@/features/customer/reviews/api/types'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

function StarRating({ rating }: { rating: number | null }) {
  const validRating = rating ?? 0

  return (
    <Badge variant="secondary">
      <Star className="size-3" aria-hidden="true" />
      <span>{validRating} / 5</span>
      <span className="sr-only">{validRating} out of 5 stars</span>
    </Badge>
  )
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Star className="size-5" aria-hidden="true" />
          </EmptyMedia>
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
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Item key={review['id']} variant="outline">
          <ItemHeader>
            <ItemContent>
              <ItemTitle>Salon review</ItemTitle>
              {review['salon_name'] ? <ItemDescription>{review['salon_name']}</ItemDescription> : null}
            </ItemContent>
            <ItemActions>
              <StarRating rating={review['rating']} />
            </ItemActions>
          </ItemHeader>
          <ItemContent>
            {review['comment'] ? (
              <ItemDescription>{review['comment']}</ItemDescription>
            ) : null}
            {review['created_at'] ? (
              <ItemDescription>
                <time dateTime={review['created_at']}>
                  {new Date(review['created_at']).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </ItemDescription>
            ) : null}
          </ItemContent>
          <ItemFooter>
            <ButtonGroup aria-label="Review actions" orientation="horizontal">
              <EditReviewDialog review={review}>
                <Button variant="outline" size="sm">
                  <Star className="size-4" aria-hidden="true" />
                  Edit review
                </Button>
              </EditReviewDialog>
              <DeleteReviewDialog review={review}>
                <Button variant="destructive" size="sm">
                  Delete review
                </Button>
              </DeleteReviewDialog>
            </ButtonGroup>
          </ItemFooter>
        </Item>
      ))}
    </div>
  )
}
