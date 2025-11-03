'use client'

import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'
import { DetailCard } from './review-detail-helpers'

type Props = {
  review: ModerationReview
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

export function ReviewMetricsSection({ review }: Props) {
  const metricCards = useMemo<DetailCardDefinition[]>(() => {
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
              <TrendingUp className="size-3" />
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

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {metricCards.slice(0, 2).map((card) => (
          <DetailCard key={card['title']} {...card} />
        ))}
      </div>

      {metricCards[2] && <DetailCard key="reputation" {...metricCards[2]} />}
    </>
  )
}
