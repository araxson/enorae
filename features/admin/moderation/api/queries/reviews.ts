import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { analyzeSentiment, type SentimentResult } from './sentiment'
import { estimateFakeLikelihood, type FakeLikelihoodInput } from './fraud'
import { calculateQualityScore } from './quality'
import { computeReviewerReputation, fetchReviewerStats, type ReviewerAggregate } from './reputation'
import { createOperationLogger } from '@/lib/observability'
import { QUERY_LIMITS } from '@/lib/config/constants'

type ReviewRow = Database['public']['Views']['admin_reviews_overview_view']['Row']

const REVIEW_LIMIT = 300

export interface ModerationFilters {
  is_flagged?: boolean
  salon_id?: string
  date_from?: string
  date_to?: string
}

export interface ModerationReview extends ReviewRow {
  customer_email: string | null
  flagged_reason: string | null
  sentimentScore: number
  sentimentLabel: 'positive' | 'neutral' | 'negative'
  fakeLikelihoodScore: number
  fakeLikelihoodLabel: 'low' | 'medium' | 'high'
  qualityScore: number
  qualityLabel: 'low' | 'medium' | 'high'
  reviewerReputation: {
    score: number
    label: 'trusted' | 'neutral' | 'risky'
    totalReviews: number
    flaggedReviews: number
  }
  commentLength: number
}

/**
 * Get reviews for moderation with derived analytics
 * SECURITY: Platform admin only
 */
export async function getReviewsForModeration(
  filters?: ModerationFilters
): Promise<ModerationReview[]> {
  const logger = createOperationLogger('getReviewsForModeration', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  let query = supabase
    .from('admin_reviews_overview_view')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.['is_flagged'] !== undefined) {
    query = query.eq('is_flagged', filters['is_flagged'])
  }

  if (filters?.['salon_id']) {
    query = query.eq('salon_id', filters['salon_id'])
  }

  if (filters?.date_from) {
    query = query.gte('created_at', filters.date_from)
  }

  if (filters?.date_to) {
    query = query.lte('created_at', filters.date_to)
  }

  const { data, error } = await query['limit'](REVIEW_LIMIT)
  if (error) throw error

  const reviews = (data || []) as ReviewRow[]
  const reviewerIds = Array.from(
    new Set(reviews.map((review) => review['customer_id']).filter(Boolean) as string[])
  ).slice(0, QUERY_LIMITS.MODERATION_SAMPLE)
  const reviewIds = Array.from(
    new Set(reviews.map((review) => review['id']).filter(Boolean) as string[])
  )

  const reviewerStats = await fetchReviewerStats(supabase, reviewerIds)

  let reviewerProfilesData: { id: string | null; email: string | null }[] = []
  if (reviewerIds.length) {
    const { data: profilesData, error: profilesError } = await supabase
      .from('admin_users_overview_view')
      .select('id, email')
      .in('id', reviewerIds)

    if (profilesError) throw profilesError
    reviewerProfilesData = profilesData ?? []
  }

  let reviewDetailsData: { id: string | null; flagged_reason: string | null }[] = []
  if (reviewIds.length) {
    const { data: detailsData, error: detailsError } = await supabase
      .schema('engagement')
      .from('salon_reviews_with_counts_view')
      .select('id, is_flagged')
      .in('id', reviewIds)

    if (detailsError) throw detailsError
    // Map is_flagged to flagged_reason (flagged_reason doesn't exist in schema)
    reviewDetailsData = (detailsData ?? []).map(row => ({
      id: row.id,
      flagged_reason: row.is_flagged ? 'Flagged' : null
    }))
  }

  const customerEmailMap = new Map(
    reviewerProfilesData
      .filter((profile): profile is { id: string; email: string | null } => Boolean(profile['id']))
      .map((profile) => [profile['id'], profile['email'] ?? null]),
  )

  const flaggedReasonMap = new Map(
    reviewDetailsData
      .filter((detail): detail is { id: string; flagged_reason: string | null } => Boolean(detail['id']))
      .map(({ id, flagged_reason }) => [id, flagged_reason ?? null]),
  )

  return reviews.map((review) => {
    const commentLength = review['comment']?.length ?? 0
    const sentiment = analyzeSentiment(review['comment'] || '')
    const fake = estimateFakeLikelihood({
      isVerified: review['is_verified'] ?? null,
      helpfulCount: review['helpful_count'] ?? null,
      commentLength,
      rating: review['rating'] ?? null,
      isFlagged: review['is_flagged'] ?? null,
      createdAt: review['created_at'],
    })
    const quality = calculateQualityScore({
      commentLength,
      helpfulCount: review['helpful_count'] ?? null,
      hasResponse: review['has_response'] ?? null,
      sentimentScore: sentiment.score,
      isFlagged: review['is_flagged'] ?? null,
    })

    const reputationSource = reviewerStats.get(review['customer_id'] ?? '') ?? {
      totalReviews: review['customer_id'] ? 1 : 0,
      flaggedReviews: review['is_flagged'] ? 1 : 0,
    }
    const reputation = computeReviewerReputation(reputationSource)

    return {
      ...review,
      customer_email: customerEmailMap.get(review['customer_id'] ?? '') ?? null,
      flagged_reason: flaggedReasonMap.get(review['id'] ?? '') ?? null,
      sentimentScore: sentiment.score,
      sentimentLabel: sentiment['label'],
      fakeLikelihoodScore: fake.score,
      fakeLikelihoodLabel: fake['label'],
      qualityScore: quality.score,
      qualityLabel: quality['label'],
      reviewerReputation: {
        ...reputation,
        totalReviews: reputationSource.totalReviews,
        flaggedReviews: reputationSource.flaggedReviews,
      },
      commentLength,
    }
  })
}

/**
 * Get flagged reviews only
 */
export async function getFlaggedReviews(): Promise<ModerationReview[]> {
  return getReviewsForModeration({ is_flagged: true })
}
