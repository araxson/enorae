'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { P, Muted } from '@/components/ui/typography'
import { ModerationStats } from './moderation-stats'
import { ModerationFilters } from './moderation-filters'
import { ReviewsTable } from './reviews-table'
import { ReviewDetailDialog } from './review-detail-dialog'
import type { ModerationReview, ModerationStats as ModerationStatsType } from '../api/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid } from '@/components/layout'

interface ModerationClientProps {
  reviews: ModerationReview[]
  stats: ModerationStatsType
}

export function ModerationClient({ reviews, stats }: ModerationClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [reputationFilter, setReputationFilter] = useState('all')
  const [viewingReview, setViewingReview] = useState<ModerationReview | null>(null)

  const filteredReviews = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase()

    return reviews.filter((review) => {
      const matchesSearch =
        !normalizedQuery ||
        review.salon_name?.toLowerCase().includes(normalizedQuery) ||
        review.customer_name?.toLowerCase().includes(normalizedQuery) ||
        review.customer_email?.toLowerCase().includes(normalizedQuery) ||
        review.comment?.toLowerCase().includes(normalizedQuery)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'flagged' && review.is_flagged) ||
        (statusFilter === 'unflagged' && !review.is_flagged) ||
        (statusFilter === 'pending' && !review.has_response) ||
        (statusFilter === 'responded' && review.has_response) ||
        (statusFilter === 'featured' && review.is_featured)

      const matchesRisk =
        riskFilter === 'all' || review.fakeLikelihoodLabel === riskFilter

      const matchesSentiment =
        sentimentFilter === 'all' || review.sentimentLabel === sentimentFilter

      const matchesReputation =
        reputationFilter === 'all' || review.reviewerReputation.label === reputationFilter

      return matchesSearch && matchesStatus && matchesRisk && matchesSentiment && matchesReputation
    })
  }, [reviews, searchQuery, statusFilter, riskFilter, sentimentFilter, reputationFilter])

  const highRiskReviews = useMemo(
    () =>
      reviews
        .filter((review) => review.fakeLikelihoodLabel === 'high' || review.is_flagged)
        .slice(0, 5),
    [reviews]
  )

  const trustedReviewers = useMemo(
    () =>
      reviews
        .filter((review) => review.reviewerReputation.label === 'trusted')
        .slice(0, 5),
    [reviews]
  )

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <P className="text-base font-semibold">Content moderation</P>
        <Muted className="text-sm">
          Monitor at-risk reviews, sentiment trends, and reviewer reputation across the platform.
        </Muted>
      </div>

      <ModerationStats stats={stats} />

      <ModerationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
        sentimentFilter={sentimentFilter}
        onSentimentFilterChange={setSentimentFilter}
        reputationFilter={reputationFilter}
        onReputationFilterChange={setReputationFilter}
      />

      <Grid cols={{ base: 1, lg: 2 }} gap="sm">
        <InsightCard
          title="High risk reviews"
          emptyLabel="No high risk reviews"
          items={highRiskReviews}
          renderBadge={(review) => (
            <Badge variant={review.fakeLikelihoodLabel === 'high' ? 'destructive' : 'default'}>
              Risk {review.fakeLikelihoodScore}
            </Badge>
          )}
        />
        <InsightCard
          title="Trusted reviewers"
          emptyLabel="No trusted reviewers"
          items={trustedReviewers}
          renderBadge={(review) => (
            <Badge variant="outline">Reputation {review.reviewerReputation.score}</Badge>
          )} 
        />
      </Grid>

      <ReviewsTable reviews={filteredReviews} onViewDetail={setViewingReview} />

      <ReviewDetailDialog
        review={viewingReview}
        open={Boolean(viewingReview)}
        onOpenChange={(open) => !open && setViewingReview(null)}
      />
    </div>
  )
}

type InsightCardProps = {
  title: string
  emptyLabel: string
  items: ModerationReview[]
  renderBadge: (review: ModerationReview) => ReactNode
}

function InsightCard({ title, emptyLabel, items, renderBadge }: InsightCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <Muted className="text-xs">{emptyLabel}</Muted>
        ) : (
          items.map((review) => (
            <div key={review.id ?? `${review.salon_id}-${review.created_at}`} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{review.customer_name || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground truncate">{review.salon_name || 'Unknown salon'}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {renderBadge(review)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
