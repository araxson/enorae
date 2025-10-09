'use client'

import { useMemo, useState } from 'react'
import { P, Muted } from '@/components/ui/typography'
import { ModerationStats } from './moderation-stats'
import { ModerationFilters } from './moderation-filters'
import { ReviewsTable } from './reviews-table'
import { ReviewDetailDialog } from './review-detail-dialog'
import type { Database } from '@/lib/types/database.types'

type Review = Database['public']['Views']['admin_reviews_overview']['Row']

type ModerationClientProps = {
  reviews: Review[]
  stats: {
    totalReviews: number
    flaggedReviews: number
    pendingReviews: number
  }
}

export function ModerationClient({ reviews, stats }: ModerationClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewingReview, setViewingReview] = useState<Review | null>(null)

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

      return matchesSearch && matchesStatus
    })
  }, [reviews, searchQuery, statusFilter])

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <P className="text-base font-semibold">Content moderation</P>
        <Muted className="text-sm">
          Monitor and moderate user-generated content.
        </Muted>
      </div>

      <ModerationStats stats={stats} />

      <ModerationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <ReviewsTable reviews={filteredReviews} onViewDetail={setViewingReview} />

      <ReviewDetailDialog
        review={viewingReview}
        open={Boolean(viewingReview)}
        onOpenChange={(open) => !open && setViewingReview(null)}
      />
    </div>
  )
}
