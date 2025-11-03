'use client'

import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'
import { InfoBlock, Panel, StatusBadges } from './review-detail-helpers'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { ReviewMetricsSection } from './review-metrics-section'
import { ReviewResponseSection } from './review-response-section'

type ReviewDetailDialogProps = {
  review: ModerationReview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReviewDetailDialog({ review, open, onOpenChange }: ReviewDetailDialogProps) {
  if (!review) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoBlock label="Salon" value={review['salon_name'] || 'Unknown'} />
            <InfoBlock label="Customer" value={review['customer_name'] || 'Anonymous'} helper={review['customer_email']} />
          </div>

          <ReviewMetricsSection review={review} />

          <StatusBadges review={review} />

          {review['is_flagged'] && review['flagged_reason'] && (
            <Panel title="Flag reason" tone="destructive">
              {review['flagged_reason']}
            </Panel>
          )}

          <Panel title="Review">
            {review['comment'] ? (
              review['comment']
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No review text provided</EmptyTitle>
                  <EmptyDescription>The reviewer submitted a rating without written feedback.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Posted on {review['created_at'] ? format(new Date(review['created_at']), 'MMMM d, yyyy') : 'Unknown date'}
            </p>
          </Panel>

          <ReviewResponseSection review={review} onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
