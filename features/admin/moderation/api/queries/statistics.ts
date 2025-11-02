import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { analyzeSentiment } from './sentiment'
import { calculateQualityScore } from './quality'
import { createOperationLogger } from '@/lib/observability/logger'
import { QUERY_LIMITS } from '@/lib/config/constants'

type ReviewRow = Database['public']['Views']['admin_reviews_overview_view']['Row']

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
  const logger = createOperationLogger('getModerationStats', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const [totalResult, flaggedResult, pendingResult, highRiskResult, sampleResult] = await Promise.all([
    // Use the RLS-compliant salon_reviews_with_counts_view to drive moderation metrics.
    supabase
      .schema('engagement')
      .from('salon_reviews_with_counts_view')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase
      .schema('engagement')
      .from('salon_reviews_with_counts_view')
      .select('id', { count: 'exact', head: true })
      .eq('is_flagged', true)
      .is('deleted_at', null),
    supabase
      .schema('engagement')
      .from('salon_reviews_with_counts_view')
      .select('id', { count: 'exact', head: true })
      .is('response', null)
      .is('deleted_at', null),
    supabase
      .schema('engagement')
      .from('salon_reviews_with_counts_view')
      .select('id', { count: 'exact', head: true })
      .or('is_flagged.eq.true,is_verified.eq.false')
      .is('deleted_at', null),
    supabase
      .from('admin_reviews_overview_view')
      .select('comment, helpful_count, has_response, is_flagged')
      .order('created_at', { ascending: false })
      .limit(QUERY_LIMITS.ANALYTICS_POINTS),
  ])

  const sample = (sampleResult.data || []) as Pick<ReviewRow, 'comment' | 'helpful_count' | 'has_response' | 'is_flagged'>[]
  let sentimentSum = 0
  let qualitySum = 0

  sample.forEach((item) => {
    const sentiment = analyzeSentiment(item['comment'] || '')
    const quality = calculateQualityScore({
      commentLength: item['comment']?.length ?? 0,
      helpfulCount: item['helpful_count'] ?? null,
      hasResponse: item['has_response'] ?? null,
      sentimentScore: sentiment.score,
      isFlagged: item['is_flagged'] ?? null,
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
