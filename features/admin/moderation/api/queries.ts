import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type ReviewRow = Database['public']['Views']['admin_reviews_overview']['Row']
type MessageThread = Database['public']['Views']['admin_messages_overview']['Row']

const POSITIVE_WORDS = [
  'great',
  'excellent',
  'amazing',
  'friendly',
  'professional',
  'clean',
  'happy',
  'love',
  'recommend',
  'perfect',
  'fantastic',
  'superb',
]

const NEGATIVE_WORDS = [
  'bad',
  'terrible',
  'awful',
  'rude',
  'dirty',
  'late',
  'horrible',
  'never',
  'worst',
  'disappointed',
  'refund',
  'angry',
]

type SentimentLabel = 'positive' | 'neutral' | 'negative'

interface SentimentResult {
  score: number
  label: SentimentLabel
}

interface FakeLikelihoodInput {
  isVerified: boolean | null
  helpfulCount: number | null
  commentLength: number
  rating: number | null
  isFlagged: boolean | null
  createdAt?: string | null
}

interface QualityScoreInput {
  commentLength: number
  helpfulCount: number | null
  hasResponse: boolean | null
  sentimentScore: number
  isFlagged: boolean | null
}

interface ReputationStats {
  totalReviews: number
  flaggedReviews: number
}

interface ReputationResult {
  score: number
  label: 'trusted' | 'neutral' | 'risky'
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function analyzeSentiment(text: string | null): SentimentResult {
  if (!text) {
    return { score: 0, label: 'neutral' }
  }

  const tokens = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  if (tokens.length === 0) {
    return { score: 0, label: 'neutral' }
  }

  let score = 0
  for (const token of tokens) {
    if (POSITIVE_WORDS.includes(token)) score += 1
    if (NEGATIVE_WORDS.includes(token)) score -= 1
  }

  const normalised = clamp(score / Math.sqrt(tokens.length), -1, 1)

  let label: SentimentLabel = 'neutral'
  if (normalised >= 0.15) label = 'positive'
  else if (normalised <= -0.15) label = 'negative'

  return { score: Number(normalised.toFixed(3)), label }
}

function estimateFakeLikelihood(input: FakeLikelihoodInput) {
  let score = 20

  if (input.isFlagged) score += 25
  if (input.isVerified === false) score += 20
  if (input.commentLength < 30) score += 20
  if ((input.helpfulCount ?? 0) === 0) score += 10
  if (input.rating !== null) {
    if (input.rating <= 2 || input.rating >= 5) score += 10
  }
  if (input.createdAt) {
    const created = new Date(input.createdAt)
    const now = Date.now()
    const diffHours = Math.abs(now - created.getTime()) / 36e5
    if (diffHours < 24) score += 5
  }

  const finalScore = clamp(Math.round(score), 0, 100)
  const label: 'high' | 'medium' | 'low' =
    finalScore >= 70 ? 'high' : finalScore >= 40 ? 'medium' : 'low'

  return { score: finalScore, label }
}

function calculateQualityScore(input: QualityScoreInput) {
  let score = 60

  if (input.commentLength > 200) score += 10
  else if (input.commentLength < 40) score -= 15

  if ((input.helpfulCount ?? 0) > 3) score += 10
  else if ((input.helpfulCount ?? 0) === 0) score -= 5

  if (input.hasResponse) score += 5
  if (input.isFlagged) score -= 20

  score += input.sentimentScore * 10

  const finalScore = clamp(Math.round(score), 0, 100)
  const label: 'high' | 'medium' | 'low' =
    finalScore >= 75 ? 'high' : finalScore >= 50 ? 'medium' : 'low'

  return { score: finalScore, label }
}

function computeReviewerReputation(stats: ReputationStats): ReputationResult {
  if (stats.totalReviews === 0) {
    return { score: 50, label: 'neutral' }
  }

  const flaggedRatio = stats.flaggedReviews / stats.totalReviews
  let score = 80 - flaggedRatio * 80

  if (stats.totalReviews < 3) score -= 10

  const finalScore = clamp(Math.round(score), 0, 100)
  let label: ReputationResult['label'] = 'neutral'

  if (finalScore >= 70) label = 'trusted'
  else if (finalScore < 40) label = 'risky'

  return { score: finalScore, label }
}

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
    .from('admin_reviews_overview')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.is_flagged !== undefined) {
    query = query.eq('is_flagged', filters.is_flagged)
  }

  if (filters?.salon_id) {
    query = query.eq('salon_id', filters.salon_id)
  }

  if (filters?.date_from) {
    query = query.gte('created_at', filters.date_from)
  }

  if (filters?.date_to) {
    query = query.lte('created_at', filters.date_to)
  }

  const { data, error } = await query.limit(REVIEW_LIMIT)
  if (error) throw error

  const reviews = (data || []) as ReviewRow[]
  const reviewerIds = Array.from(
    new Set(reviews.map((review) => review.customer_id).filter(Boolean) as string[])
  ).slice(0, 500)
  const reviewIds = Array.from(
    new Set(reviews.map((review) => review.id).filter(Boolean) as string[])
  )

  const reviewerStats = await fetchReviewerStats(supabase, reviewerIds)

  let reviewerProfilesData: { id: string | null; email: string | null }[] = []
  if (reviewerIds.length) {
    const { data: profilesData, error: profilesError } = await supabase
      .from('admin_users_overview')
      .select('id, email')
      .in('id', reviewerIds)

    if (profilesError) throw profilesError
    reviewerProfilesData = profilesData ?? []
  }

  let reviewDetailsData: { id: string | null; flagged_reason: string | null }[] = []
  if (reviewIds.length) {
    const { data: detailsData, error: detailsError } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .select('id, flagged_reason')
      .in('id', reviewIds)

    if (detailsError) throw detailsError
    reviewDetailsData = detailsData ?? []
  }

  const customerEmailMap = new Map(
    reviewerProfilesData
      .filter((profile): profile is { id: string; email: string | null } => Boolean(profile.id))
      .map((profile) => [profile.id, profile.email ?? null]),
  )

  const flaggedReasonMap = new Map(
    reviewDetailsData
      .filter((detail): detail is { id: string; flagged_reason: string | null } => Boolean(detail.id))
      .map(({ id, flagged_reason }) => [id, flagged_reason ?? null]),
  )

  return reviews.map((review) => {
    const commentLength = review.comment?.length ?? 0
    const sentiment = analyzeSentiment(review.comment || '')
    const fake = estimateFakeLikelihood({
      isVerified: review.is_verified ?? null,
      helpfulCount: review.helpful_count ?? null,
      commentLength,
      rating: review.rating ?? null,
      isFlagged: review.is_flagged ?? null,
      createdAt: review.created_at,
    })
    const quality = calculateQualityScore({
      commentLength,
      helpfulCount: review.helpful_count ?? null,
      hasResponse: review.has_response ?? null,
      sentimentScore: sentiment.score,
      isFlagged: review.is_flagged ?? null,
    })

    const reputationSource = reviewerStats.get(review.customer_id ?? '') ?? {
      totalReviews: review.customer_id ? 1 : 0,
      flaggedReviews: review.is_flagged ? 1 : 0,
    }
    const reputation = computeReviewerReputation(reputationSource)

    return {
      ...review,
      customer_email: customerEmailMap.get(review.customer_id ?? '') ?? null,
      flagged_reason: flaggedReasonMap.get(review.id ?? '') ?? null,
      sentimentScore: sentiment.score,
      sentimentLabel: sentiment.label,
      fakeLikelihoodScore: fake.score,
      fakeLikelihoodLabel: fake.label,
      qualityScore: quality.score,
      qualityLabel: quality.label,
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

/**
 * Get message threads for monitoring
 * SECURITY: Platform admin only
 */
export async function getMessageThreadsForMonitoring(): Promise<MessageThread[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_messages_overview')
    .select('*')
    .order('last_message_at', { ascending: false })
    .limit(200)

  if (error) throw error
  return data || []
}

export interface ModerationStats {
  totalReviews: number
  flaggedReviews: number
  pendingReviews: number
  highRiskReviews: number
  averageSentiment: number
  averageQuality: number
}

/**
 * Get moderation statistics with high-risk insights
 * SECURITY: Platform admin only
 */
export async function getModerationStats(): Promise<ModerationStats> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const [totalResult, flaggedResult, pendingResult, highRiskResult, sampleResult] = await Promise.all([
    // We need raw engagement.salon_reviews data for admin-only moderation metrics that are not exposed via views.
    supabase
      .schema('engagement')
      .from('salon_reviews')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase
      .schema('engagement')
      .from('salon_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('is_flagged', true)
      .is('deleted_at', null),
    supabase
      .schema('engagement')
      .from('salon_reviews')
      .select('*', { count: 'exact', head: true })
      .is('response', null)
      .is('deleted_at', null),
    supabase
      .schema('engagement')
      .from('salon_reviews')
      .select('*', { count: 'exact', head: true })
      .or('is_flagged.eq.true,is_verified.eq.false')
      .is('deleted_at', null),
    supabase
      .from('admin_reviews_overview')
      .select('comment, helpful_count, has_response, is_flagged')
      .order('created_at', { ascending: false })
      .limit(150),
  ])

  const sample = (sampleResult.data || []) as Pick<ReviewRow, 'comment' | 'helpful_count' | 'has_response' | 'is_flagged'>[]
  let sentimentSum = 0
  let qualitySum = 0

  sample.forEach((item) => {
    const sentiment = analyzeSentiment(item.comment || '')
    const quality = calculateQualityScore({
      commentLength: item.comment?.length ?? 0,
      helpfulCount: item.helpful_count ?? null,
      hasResponse: item.has_response ?? null,
      sentimentScore: sentiment.score,
      isFlagged: item.is_flagged ?? null,
    })
    sentimentSum += sentiment.score
    qualitySum += quality.score
  })

  const divisor = sample.length || 1

  return {
    totalReviews: totalResult.count || 0,
    flaggedReviews: flaggedResult.count || 0,
    pendingReviews: pendingResult.count || 0,
    highRiskReviews: highRiskResult.count || 0,
    averageSentiment: Number((sentimentSum / divisor).toFixed(2)),
    averageQuality: Math.round(qualitySum / divisor) || 0,
  }
}

async function fetchReviewerStats(
  supabase: ReturnType<typeof createServiceRoleClient>,
  reviewerIds: string[],
) {
  if (!reviewerIds.length) return new Map<string, ReviewerAggregate>()

  const { data, error } = await supabase
    // Admin reviewer reputation analysis requires per-review rows, so we access the underlying table with platform admin credentials.
    .schema('engagement')
    .from('salon_reviews')
    .select('customer_id, is_flagged')
    .in('customer_id', reviewerIds)
    .limit(REVIEWER_SAMPLE_LIMIT)

  if (error) throw error

  const map = new Map<string, ReviewerAggregate>()
  for (const row of data || []) {
    if (!row.customer_id) continue
    const current = map.get(row.customer_id) ?? { totalReviews: 0, flaggedReviews: 0 }
    current.totalReviews += 1
    if (row.is_flagged) current.flaggedReviews += 1
    map.set(row.customer_id, current)
  }
  return map
}
