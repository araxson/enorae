'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'
import { ReviewsTableRow } from '../reviews-table-row'
import { useReviewActions } from '../../hooks/use-review-actions'
import { ActionDialog } from './action-dialog'

const EMPTY_MESSAGE = 'No reviews found'

type ReviewsTableProps = {
  reviews: ModerationReview[]
  onViewDetail: (review: ModerationReview) => void
}

export function ReviewsTable({ reviews, onViewDetail }: ReviewsTableProps) {
  const {
    loadingId,
    dialog,
    reason,
    reasonError,
    requiresReason,
    openDialog,
    closeDialog,
    handleAction,
    setReason,
    setReasonError,
  } = useReviewActions()

  return (
    <>
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Reviews moderation</CardTitle>
                <CardDescription>Review customer feedback and take moderation actions.</CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
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
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>{EMPTY_MESSAGE}</EmptyTitle>
                        <EmptyDescription>Adjust filters or timeframe to explore other review sets.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <ReviewsTableRow
                    key={review.id}
                    review={review}
                    loadingId={loadingId}
                    onViewDetail={onViewDetail}
                    onFlag={(r) => openDialog('flag', r)}
                    onUnflag={(r) => openDialog('unflag', r)}
                    onToggleFeature={(r) => openDialog('feature', r)}
                    onDelete={(r) => openDialog('delete', r)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ActionDialog
        dialog={dialog}
        reason={reason}
        reasonError={reasonError}
        requiresReason={requiresReason}
        loadingId={loadingId}
        onClose={closeDialog}
        onConfirm={handleAction}
        onReasonChange={setReason}
        onReasonErrorClear={() => setReasonError(null)}
      />
    </>
  )
}
