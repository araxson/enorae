'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Database } from '@/lib/types/database.types'
import { ReviewsTableRow } from './reviews-table-row'
import { useReviewActions } from './use-review-actions'

const EMPTY_MESSAGE = 'No reviews found'

type Review = Database['public']['Views']['admin_reviews_overview']['Row']

type ReviewsTableProps = {
  reviews: Review[]
  onViewDetail: (review: Review) => void
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
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
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
