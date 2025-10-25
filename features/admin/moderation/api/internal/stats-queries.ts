import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { analyzeSentiment, calculateQualityScore } from './analytics'

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
    supabase
      .from('admin_reviews_overview_view')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('admin_reviews_overview_view')
      .select('id', { count: 'exact', head: true })
      .eq('is_flagged', true),
    supabase
      .from('admin_reviews_overview_view')
      .select('id', { count: 'exact', head: true })
      .or('has_response.eq.false,has_response.is.null'),
    supabase
      .from('admin_reviews_overview_view')
      .select('id', { count: 'exact', head: true })
      .or('is_flagged.eq.true,is_verified.eq.false'),
    supabase
      .from('admin_reviews_overview_view')
      .select('comment, helpful_count, has_response, is_flagged')
      .order('created_at', { ascending: false })
      .limit(150),
  ])

  // Type for sample review data
  type ReviewSample = {
    comment: string | null
    helpful_count: number | null
    has_response: boolean | null
    is_flagged: boolean | null
  }

  const sample = (sampleResult.data || []) as ReviewSample[]
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
