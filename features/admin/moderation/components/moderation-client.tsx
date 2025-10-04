'use client'

import { useState, useMemo } from 'react'
import { Stack, Flex, Box } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { ModerationStats } from './moderation-stats'
import { ModerationFilters } from './moderation-filters'
import { ReviewsTable } from './reviews-table'
import { ReviewDetailDialog } from './review-detail-dialog'

type Review = {
  id: string
  salon_name?: string | null
  customer_name?: string | null
  customer_email?: string | null
  rating: number
  review_text?: string | null
  is_flagged: boolean
  flagged_reason?: string | null
  response?: string | null
  response_date?: string | null
  is_featured: boolean
  created_at: string
}

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
    return reviews.filter((review) => {
      const matchesSearch =
        !searchQuery ||
        review.salon_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.review_text?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'flagged' && review.is_flagged) ||
        (statusFilter === 'unflagged' && !review.is_flagged) ||
        (statusFilter === 'pending' && !review.response) ||
        (statusFilter === 'responded' && review.response) ||
        (statusFilter === 'featured' && review.is_featured)

      return matchesSearch && matchesStatus
    })
  }, [reviews, searchQuery, statusFilter])

  return (
    <Stack gap="xl">
      <Flex align="center" justify="between">
        <Box>
          <H1>Content Moderation</H1>
          <P className="text-muted-foreground mt-1">
            Monitor and moderate user-generated content
          </P>
        </Box>
      </Flex>

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
        open={!!viewingReview}
        onOpenChange={(open) => !open && setViewingReview(null)}
      />
    </Stack>
  )
}
