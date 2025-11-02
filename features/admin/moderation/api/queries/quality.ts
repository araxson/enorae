import 'server-only'

import { createOperationLogger } from '@/lib/observability/logger'
import { MODERATION_THRESHOLDS } from '@/lib/config/constants'

interface QualityScoreInput {
  commentLength: number
  helpfulCount: number | null
  hasResponse: boolean | null
  sentimentScore: number
  isFlagged: boolean | null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate quality score for a review based on length, helpfulness, and sentiment
 */
export function calculateQualityScore(input: QualityScoreInput) {
  let score = MODERATION_THRESHOLDS.BASE_QUALITY_SCORE

  if (input.commentLength > MODERATION_THRESHOLDS.DETAILED_REVIEW_LENGTH) {
    score += MODERATION_THRESHOLDS.DETAILED_REVIEW_BONUS
  } else if (input.commentLength < MODERATION_THRESHOLDS.SHORT_REVIEW_LENGTH) {
    score -= MODERATION_THRESHOLDS.SHORT_REVIEW_PENALTY
  }

  if ((input.helpfulCount ?? 0) > MODERATION_THRESHOLDS.HELPFUL_VOTE_THRESHOLD) {
    score += MODERATION_THRESHOLDS.HELPFUL_REVIEW_BONUS
  } else if ((input.helpfulCount ?? 0) === 0) {
    score -= MODERATION_THRESHOLDS.UNHELPFUL_REVIEW_PENALTY
  }

  if (input.hasResponse) score += MODERATION_THRESHOLDS.RESPONDED_REVIEW_BONUS
  if (input.isFlagged) score -= MODERATION_THRESHOLDS.FLAGGED_REVIEW_PENALTY

  score += input.sentimentScore * MODERATION_THRESHOLDS.SENTIMENT_SCORE_MULTIPLIER

  const finalScore = clamp(Math.round(score), 0, 100)
  const label: 'high' | 'medium' | 'low' =
    finalScore >= MODERATION_THRESHOLDS.HIGH_QUALITY_THRESHOLD ? 'high'
    : finalScore >= MODERATION_THRESHOLDS.MEDIUM_QUALITY_THRESHOLD ? 'medium'
    : 'low'

  return { score: finalScore, label }
}
