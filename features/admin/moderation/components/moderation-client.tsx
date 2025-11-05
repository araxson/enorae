'use client'

import { useMemo, useState } from 'react'
import { ModerationStats } from './moderation-stats'
import { ModerationFilters } from './moderation-filters'
import { ReviewsTable } from './reviews-table'
import { ReviewDetailDialog } from './review-detail-dialog'
import { InsightCard } from './insight-card'
import type { ModerationReview, ModerationStats as ModerationStatsType } from '@/features/admin/moderation/api/queries'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'

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

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setRiskFilter('all')
    setSentimentFilter('all')
    setReputationFilter('all')
  }

  const filteredReviews = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase()

    return reviews.filter((review) => {
      const customerEmail = review['customer_email']?.toLowerCase() ?? ''
      const matchesSearch =
        !normalizedQuery ||
        review['salon_name']?.toLowerCase().includes(normalizedQuery) ||
        review['customer_name']?.toLowerCase().includes(normalizedQuery) ||
        customerEmail.includes(normalizedQuery) ||
        review['comment']?.toLowerCase().includes(normalizedQuery)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'flagged' && review['is_flagged']) ||
        (statusFilter === 'unflagged' && !review['is_flagged']) ||
        (statusFilter === 'pending' && !review['has_response']) ||
        (statusFilter === 'responded' && review['has_response']) ||
        (statusFilter === 'featured' && review['is_featured'])

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
        .filter((review) => review.fakeLikelihoodLabel === 'high' || review['is_flagged'])
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
      <ItemGroup>
        <Item variant="muted">
          <ItemContent>
            <p className="text-base font-semibold">Content moderation</p>
            <p className="text-sm text-muted-foreground">
              Monitor at-risk reviews, sentiment trends, and reviewer reputation across the platform.
            </p>
          </ItemContent>
        </Item>
      </ItemGroup>

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
        onClearFilters={clearFilters}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
      </div>

      <ReviewsTable reviews={filteredReviews} onViewDetail={setViewingReview} />

      <ReviewDetailDialog
        review={viewingReview}
        open={Boolean(viewingReview)}
        onOpenChange={(open) => !open && setViewingReview(null)}
      />
    </div>
  )
}
