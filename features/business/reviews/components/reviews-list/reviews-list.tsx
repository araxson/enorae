'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
      <div className="flex flex-col gap-4">
        {normalizedReviews.length === 0 ? (
          <Card>
            <CardHeader className="items-center justify-center">
              <CardTitle>No reviews yet</CardTitle>
              <CardDescription>Reviews will appear once customers share feedback.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          normalizedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onRespond={actions.selectReview}
              onFlag={actions.openFlagDialog}
              onToggleFeatured={handlers.handleToggleFeatured}
            />
          ))
        )}
      </div>

      <Dialog open={!!state.selectedReview} onOpenChange={(open) => !open && actions.selectReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {state.selectedReview && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{state.selectedReview.customer_name || 'Anonymous'}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {state.selectedReview.comment ? (
                    <p className="leading-7 text-sm">{state.selectedReview.comment}</p>
                  ) : null}
                </CardContent>
              </Card>
            )}
            <Textarea
              placeholder="Type your response here..."
              value={state.response}
              onChange={(event) => actions.setResponse(event.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => actions.selectReview(null)} disabled={state.isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handlers.handleRespond} disabled={state.isSubmitting || !state.response.trim()}>
              {state.isSubmitting ? 'Posting...' : 'Post Response'}
            </Button>
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
            <Button variant="outline" onClick={actions.closeFlagDialog} disabled={state.isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handlers.handleFlag} disabled={state.isSubmitting || !state.flagReason.trim()}>
              {state.isSubmitting ? 'Flagging...' : 'Flag Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
