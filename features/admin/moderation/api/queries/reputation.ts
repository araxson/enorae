import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { createOperationLogger } from '@/lib/observability/logger'
import { DATA_LIMITS, MODERATION_THRESHOLDS } from '@/lib/config/constants'

interface ReputationStats {
  totalReviews: number
  flaggedReviews: number
}

export interface ReputationResult {
  score: number
  label: 'trusted' | 'neutral' | 'risky'
}

export interface ReviewerAggregate {
  totalReviews: number
  flaggedReviews: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Compute reputation score for a reviewer based on their review history
 */
export function computeReviewerReputation(stats: ReputationStats): ReputationResult {
  if (stats.totalReviews === 0) {
    return { score: MODERATION_THRESHOLDS.DEFAULT_REPUTATION_SCORE, label: 'neutral' }
  }

  const flaggedRatio = stats.flaggedReviews / stats.totalReviews
  let score = MODERATION_THRESHOLDS.REPUTATION_BASE_SCORE - flaggedRatio * MODERATION_THRESHOLDS.REPUTATION_BASE_SCORE

  if (stats.totalReviews < MODERATION_THRESHOLDS.MIN_REVIEWS_FOR_REPUTATION) {
    score -= MODERATION_THRESHOLDS.LOW_REVIEW_COUNT_PENALTY
  }

  const finalScore = clamp(Math.round(score), 0, 100)
  let label: ReputationResult['label'] = 'neutral'

  if (finalScore >= MODERATION_THRESHOLDS.TRUSTED_REPUTATION_THRESHOLD) label = 'trusted'
  else if (finalScore < MODERATION_THRESHOLDS.RISKY_REPUTATION_THRESHOLD) label = 'risky'

  return { score: finalScore, label }
}

/**
 * Fetch reviewer statistics from database
 * SECURITY: Uses service role client with RLS-compliant view
 */
export async function fetchReviewerStats(
  supabase: ReturnType<typeof createServiceRoleClient>,
  reviewerIds: string[],
) {
  const logger = createOperationLogger('fetchReviewerStats', {})
  logger.start()

  if (!reviewerIds.length) return new Map<string, ReviewerAggregate>()

  const { data, error } = await supabase
    // Use the counts view to analyze reviewer reputation without bypassing RLS.
    .schema('engagement')
    .from('salon_reviews_with_counts_view')
    .select('customer_id, is_flagged')
    .in('customer_id', reviewerIds)
    .limit(DATA_LIMITS.REVIEWER_SAMPLE_LIMIT)

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
