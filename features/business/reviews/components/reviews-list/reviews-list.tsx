'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { ButtonGroup } from '@/components/ui/button-group'
import type { SalonReviewWithDetails } from '@/features/business/reviews/api/queries'
import { ReviewCard } from './review-card'
import { useReviewsList } from './use-reviews-list'

interface ReviewsListProps {
  reviews: SalonReviewWithDetails[]
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  const { reviews: normalizedReviews, state, actions, handlers } = useReviewsList({ reviews })

  return (
    <>
      {normalizedReviews.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription>Reviews will appear once customers share feedback.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ItemGroup className="gap-4">
          {normalizedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onRespond={actions.selectReview}
              onFlag={actions.openFlagDialog}
              onToggleFeatured={handlers.handleToggleFeatured}
            />
          ))}
        </ItemGroup>
      )}

      <Dialog open={!!state.selectedReview} onOpenChange={(open) => !open && actions.selectReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {state.selectedReview && (
              <ItemGroup>
                <Item variant="muted" className="flex-col gap-2">
                  <ItemTitle>{state.selectedReview.customer_name || 'Anonymous'}</ItemTitle>
                  {state.selectedReview.comment ? (
                    <ItemContent>
                      <ItemDescription>{state.selectedReview.comment}</ItemDescription>
                    </ItemContent>
                  ) : null}
                </Item>
              </ItemGroup>
            )}
            <Textarea
              placeholder="Type your response here..."
              value={state.response}
              onChange={(event) => actions.setResponse(event.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="outline" onClick={() => actions.selectReview(null)} disabled={state.isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handlers.handleRespond} disabled={state.isSubmitting || !state.response.trim()}>
                {state.isSubmitting ? 'Posting...' : 'Post Response'}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={state.showFlagDialog} onOpenChange={(open) => !open && actions.closeFlagDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Review</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="Reason for flagging (e.g., inappropriate content, spam, fake review)..."
              value={state.flagReason}
              onChange={(event) => actions.setFlagReason(event.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="outline" onClick={actions.closeFlagDialog} disabled={state.isSubmitting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handlers.handleFlag} disabled={state.isSubmitting || !state.flagReason.trim()}>
                {state.isSubmitting ? 'Flagging...' : 'Flag Review'}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
