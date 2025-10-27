'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { format } from 'date-fns'
import { MessageSquare, TrendingUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { respondToReview } from '@/features/admin/moderation/api/mutations'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'
import { DetailCard, InfoBlock, Panel, StatusBadges } from './review-detail-helpers'
import { ReviewResponseForm } from './review-response-form'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

type ReviewDetailDialogProps = {
  review: ModerationReview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DetailCardDefinition = {
  title: string
  badge: ReactNode
  description?: string
}

const sentimentVariant = (label: ModerationReview['sentimentLabel']) =>
  label === 'positive' ? 'default' : label === 'neutral' ? 'secondary' : 'destructive'

const reputationVariant = (label: ModerationReview['reviewerReputation']['label']) =>
  label === 'trusted' ? 'default' : label === 'neutral' ? 'secondary' : 'destructive'

export function ReviewDetailDialog({ review, open, onOpenChange }: ReviewDetailDialogProps) {
  const [isResponding, setIsResponding] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const metricCards = useMemo<DetailCardDefinition[]>(() => {
    if (!review) {
      return []
    }
    return [
      {
        title: 'Sentiment analysis',
        badge: (
          <Badge variant={sentimentVariant(review.sentimentLabel)}>
            {review.sentimentLabel} ({review.sentimentScore})
          </Badge>
        ),
        description: `${review.commentLength} characters analysed`,
      },
      {
        title: 'Risk & quality',
        badge: (
          <div className="flex gap-2">
            <Badge variant={review.fakeLikelihoodLabel === 'high' ? 'destructive' : review.fakeLikelihoodLabel === 'medium' ? 'default' : 'outline'}>
              Risk {review.fakeLikelihoodScore}
            </Badge>
            <Badge
              variant={review.qualityLabel === 'low' ? 'destructive' : review.qualityLabel === 'medium' ? 'default' : 'secondary'}
              className="gap-1"
            >
              <TrendingUp className="h-3 w-3" />
              Quality {review.qualityScore}
            </Badge>
          </div>
        ),
        description: review['is_flagged'] ? 'Currently flagged for moderator review' : 'No active flags',
      },
      {
        title: 'Reviewer reputation',
        badge: (
          <Badge variant={reputationVariant(review.reviewerReputation['label'])}>
            {review.reviewerReputation['label']} ({review.reviewerReputation.score})
          </Badge>
        ),
        description: `${review.reviewerReputation.totalReviews} reviews · ${review.reviewerReputation.flaggedReviews} flagged`,
      },
    ]
  }, [review])

  if (!review) return null

  async function handleSubmitResponse() {
    if (!review) {
      toast.error('Review data is unavailable')
      return
    }

    if (!responseText.trim()) {
      toast.error('Response cannot be empty')
      return
    }
    if (!review['id']) {
      toast.error('Invalid review ID')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('reviewId', review['id'])
    formData.append('response', responseText)

    const result = await respondToReview(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Your response has been added to the review.')
    setIsResponding(false)
    setResponseText('')
    onOpenChange(false)
  }

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

          <div className="grid gap-4 md:grid-cols-2">
            {metricCards.slice(0, 2).map((card) => (
              <DetailCard key={card['title']} {...card} />
            ))}
          </div>

          {metricCards[2] && <DetailCard key="reputation" {...metricCards[2]} />}

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

          {review['has_response'] && (
            <Panel title="Response" tone="info">
              Response has been recorded. Response content is not available in this overview.
              {review['response_date'] && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Responded on {format(new Date(review['response_date']), 'MMMM d, yyyy')}
                </p>
              )}
            </Panel>
          )}

          {!review['has_response'] && !isResponding && (
            <Button onClick={() => setIsResponding(true)} variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Add response
            </Button>
          )}

          {isResponding && (
            <ReviewResponseForm
              value={responseText}
              onChange={setResponseText}
              onCancel={() => {
                setIsResponding(false)
                setResponseText('')
              }}
              onSubmit={handleSubmitResponse}
              isLoading={isLoading}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
