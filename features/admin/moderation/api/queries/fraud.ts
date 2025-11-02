import 'server-only'

import { createOperationLogger } from '@/lib/observability'

// Fraud detection score weights
const FRAUD_SCORE_BASE = 20
const FRAUD_SCORE_FLAGGED_PENALTY = 25
const FRAUD_SCORE_UNVERIFIED_PENALTY = 20
const FRAUD_SCORE_SHORT_COMMENT_PENALTY = 20
const FRAUD_SCORE_NO_HELPFUL_PENALTY = 10
const FRAUD_SCORE_EXTREME_RATING_PENALTY = 10
const FRAUD_SCORE_RECENT_REVIEW_PENALTY = 5

// Fraud detection thresholds
const MINIMUM_COMMENT_LENGTH = 30
const MINIMUM_RATING_THRESHOLD = 2
const MAXIMUM_RATING_THRESHOLD = 5
const HOURS_PER_DAY = 24
const MILLISECONDS_PER_HOUR = 3600000
const FRAUD_SCORE_HIGH_THRESHOLD = 70
const FRAUD_SCORE_MEDIUM_THRESHOLD = 40
const SCORE_MIN = 0
const SCORE_MAX = 100

export interface FakeLikelihoodInput {
  isVerified: boolean | null
  helpfulCount: number | null
  commentLength: number
  rating: number | null
  isFlagged: boolean | null
  createdAt?: string | null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Estimate likelihood of a review being fake based on various factors
 */
export function estimateFakeLikelihood(input: FakeLikelihoodInput) {
  let score = FRAUD_SCORE_BASE

  if (input.isFlagged) score += FRAUD_SCORE_FLAGGED_PENALTY
  if (input.isVerified === false) score += FRAUD_SCORE_UNVERIFIED_PENALTY
  if (input.commentLength < MINIMUM_COMMENT_LENGTH) score += FRAUD_SCORE_SHORT_COMMENT_PENALTY
  if ((input.helpfulCount ?? 0) === 0) score += FRAUD_SCORE_NO_HELPFUL_PENALTY
  if (input['rating'] !== null) {
    if (input['rating'] <= MINIMUM_RATING_THRESHOLD || input['rating'] >= MAXIMUM_RATING_THRESHOLD) {
      score += FRAUD_SCORE_EXTREME_RATING_PENALTY
    }
  }
  if (input.createdAt) {
    const created = new Date(input.createdAt)
    const now = Date.now()
    const diffHours = Math.abs(now - created.getTime()) / MILLISECONDS_PER_HOUR
    if (diffHours < HOURS_PER_DAY) score += FRAUD_SCORE_RECENT_REVIEW_PENALTY
  }

  const finalScore = clamp(Math.round(score), SCORE_MIN, SCORE_MAX)
  const label: 'high' | 'medium' | 'low' =
    finalScore >= FRAUD_SCORE_HIGH_THRESHOLD ? 'high' : finalScore >= FRAUD_SCORE_MEDIUM_THRESHOLD ? 'medium' : 'low'

  return { score: finalScore, label }
}
