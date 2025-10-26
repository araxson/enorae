import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'

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

const REVIEWER_SAMPLE_LIMIT = 5000

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Compute reputation score for a reviewer based on their review history
 */
export function computeReviewerReputation(stats: ReputationStats): ReputationResult {
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

/**
 * Fetch reviewer statistics from database
 * SECURITY: Uses service role client with RLS-compliant view
 */
export async function fetchReviewerStats(
  supabase: ReturnType<typeof createServiceRoleClient>,
  reviewerIds: string[],
) {
  if (!reviewerIds.length) return new Map<string, ReviewerAggregate>()

  const { data, error } = await supabase
    // Use the counts view to analyze reviewer reputation without bypassing RLS.
    .schema('engagement')
    .from('salon_reviews_with_counts_view')
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
