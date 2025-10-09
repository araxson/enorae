'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ReviewsTableRow } from './reviews-table-row'
import { useReviewActions } from './use-review-actions'
import type { ModerationReview } from '../api/queries'

const EMPTY_MESSAGE = 'No reviews found'

type ReviewsTableProps = {
  reviews: ModerationReview[]
  onViewDetail: (review: ModerationReview) => void
}

export function ReviewsTable({ reviews, onViewDetail }: ReviewsTableProps) {
  const actions = useReviewActions()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Salon</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Reputation</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                {EMPTY_MESSAGE}
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <ReviewsTableRow
                key={review.id}
                review={review}
                actions={actions}
                onViewDetail={onViewDetail}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
