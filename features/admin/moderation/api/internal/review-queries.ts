import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import {
  analyzeSentiment,
  estimateFakeLikelihood,
  calculateQualityScore,
  computeReviewerReputation,
} from '@/lib/utils/review-analytics'

type MessageThread = Database['public']['Views']['admin_messages_overview_view']['Row']
type ReviewRow = Database['public']['Views']['admin_reviews_overview_view']['Row']
type CustomerRow = Database['public']['Views']['admin_users_overview_view']['Row']
type ServiceRoleClient = ReturnType<typeof createServiceRoleClient>

type CustomerEmailRow = Pick<CustomerRow, 'id' | 'email'>
export interface ModerationFilters {
  is_flagged?: boolean
  salon_id?: string
  date_from?: string
  date_to?: string
}

export type ModerationReview = Omit<ReviewRow, 'id' | 'created_at'> & {
  id: string
  created_at: string
  customer_email: string | null
  flagged_reason: string | null
  deleted_at: string | null
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

interface ReviewerAggregate {
  totalReviews: number
  flaggedReviews: number
}

const REVIEW_LIMIT = 300
const REVIEWER_SAMPLE_LIMIT = 5000

/**
 * Get reviews for moderation with derived analytics
 * SECURITY: Platform admin only
 */
export async function getReviewsForModeration(
  filters?: ModerationFilters
): Promise<ModerationReview[]> {
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

  const { data, error } = await query['limit'](REVIEW_LIMIT).returns<ReviewRow[]>()
  if (error) throw error

  const reviews = (data ?? []).filter(
    (review): review is ReviewRow & { id: string; created_at: string } =>
      Boolean(review['id'] && review['created_at']),
  )

  const reviewIds = reviews.map((review) => review['id'])
  const customerIds = Array.from(
    new Set(reviews.map((review) => review['customer_id']).filter((id): id is string => Boolean(id))),
  ).slice(0, 500)

  const [customerEmailMap, reviewerStats] = await Promise.all([
    fetchCustomerEmails(supabase, customerIds),
    fetchReviewerStats(supabase, customerIds),
  ])

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

    const stats = review['customer_id']
      ? reviewerStats.get(review['customer_id']) ?? {
          totalReviews: 1,
          flaggedReviews: review['is_flagged'] ? 1 : 0,
        }
      : { totalReviews: 0, flaggedReviews: 0 }
    const reputation = computeReviewerReputation(stats)
    const customerEmail = review['customer_id']
      ? customerEmailMap.get(review['customer_id']) ?? null
      : null

    return {
      ...review,
      customer_email: customerEmail,
      flagged_reason: null,
      deleted_at: null,
      sentimentScore: sentiment.score,
      sentimentLabel: sentiment['label'],
      fakeLikelihoodScore: fake.score,
      fakeLikelihoodLabel: fake['label'],
      qualityScore: quality.score,
      qualityLabel: quality['label'],
      reviewerReputation: {
        ...reputation,
        totalReviews: stats.totalReviews,
        flaggedReviews: stats.flaggedReviews,
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

/**
 * Get message threads for monitoring
 * SECURITY: Platform admin only
 */
export async function getMessageThreadsForMonitoring(): Promise<MessageThread[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_messages_overview_view')
    .select('*')
    .order('last_message_at', { ascending: false })
    .limit(200)

  if (error) throw error
  return data || []
}

async function fetchReviewerStats(
  supabase: ServiceRoleClient,
  reviewerIds: string[],
): Promise<Map<string, ReviewerAggregate>> {
  if (!reviewerIds.length) return new Map<string, ReviewerAggregate>()

  const { data, error } = await supabase
    .from('admin_reviews_overview_view')
    .select('customer_id, is_flagged')
    .in('customer_id', reviewerIds)
    .limit(REVIEWER_SAMPLE_LIMIT)

  if (error) throw error

  const map = new Map<string, ReviewerAggregate>()
  for (const row of data || []) {
    if (!row['customer_id']) continue
    const current = map.get(row['customer_id']) ?? { totalReviews: 0, flaggedReviews: 0 }
    current.totalReviews += 1
    if (row['is_flagged']) current.flaggedReviews += 1
    map.set(row['customer_id'], current)
  }
  return map
}

async function fetchCustomerEmails(
  supabase: ServiceRoleClient,
  customerIds: string[],
): Promise<Map<string, string | null>> {
  if (!customerIds.length) return new Map<string, string | null>()

  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('id, email')
    .in('id', customerIds)
    .returns<CustomerEmailRow[]>()

  if (error) throw error

  const map = new Map<string, string | null>()
  for (const row of data ?? []) {
    if (!row['id']) continue
    map.set(row['id'], row['email'] ?? null)
  }
  return map
}
