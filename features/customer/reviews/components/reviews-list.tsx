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
  ItemGroup,
  ItemFooter,
  ItemHeader,
  ItemTitle,
  ItemSeparator,
} from '@/components/ui/item'

function StarRating({ rating }: { rating: number | null }) {
  const validRating = rating ?? 0

  return (
    <Badge variant="secondary" className="gap-1">
      <Star className="size-3 fill-accent text-accent" aria-hidden="true" />
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
            <Star className="size-6" />
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
    <div className="grid gap-6">
      {reviews.map((review) => (
        <Item key={review['id']} variant="outline" className="flex flex-col gap-4 p-6">
          <ItemHeader>
            <ItemContent>
              <ItemTitle>Salon review</ItemTitle>
              {review['salon_name'] ? <ItemDescription>{review['salon_name']}</ItemDescription> : null}
            </ItemContent>
            <ItemActions>
              <StarRating rating={review['rating']} />
            </ItemActions>
          </ItemHeader>
          <ItemContent className="gap-4">
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemDescription>{review['comment']}</ItemDescription>
                </ItemContent>
              </Item>
              {review['created_at'] ? <ItemSeparator /> : null}
              {review['created_at'] ? (
                <Item size="sm" variant="muted">
                  <ItemContent>
                    <ItemDescription>
                      <time dateTime={review['created_at']}>
                        {new Date(review['created_at']).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ) : null}
            </ItemGroup>
          </ItemContent>
          <ItemFooter>
            <ButtonGroup aria-label="Review actions" orientation="horizontal">
              <EditReviewDialog review={review}>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Star className="mr-2 size-4" aria-hidden="true" />
                  Edit review
                </Button>
              </EditReviewDialog>
              <DeleteReviewDialog review={review}>
                <Button variant="destructive" size="sm" className="flex-1 sm:flex-none">
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
