/**
 * Review Analytics & Scoring
 * Sentiment analysis, fake detection, quality scoring, and reputation
 */

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

export type SentimentLabel = 'positive' | 'neutral' | 'negative'

export interface SentimentResult {
  score: number
  label: SentimentLabel
}

export interface FakeLikelihoodInput {
  isVerified: boolean | null
  helpfulCount: number | null
  commentLength: number
  rating: number | null
  isFlagged: boolean | null
  createdAt?: string | null
}

export interface QualityScoreInput {
  commentLength: number
  helpfulCount: number | null
  hasResponse: boolean | null
  sentimentScore: number
  isFlagged: boolean | null
}

export interface ReputationStats {
  totalReviews: number
  flaggedReviews: number
}

export interface ReputationResult {
  score: number
  label: 'trusted' | 'neutral' | 'risky'
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function analyzeSentiment(text: string | null): SentimentResult {
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

  const SENTIMENT_POSITIVE_THRESHOLD = 0.15
  const SENTIMENT_NEGATIVE_THRESHOLD = -0.15
  const SENTIMENT_SCORE_PRECISION = 3

  let label: SentimentLabel = 'neutral'
  if (normalised >= SENTIMENT_POSITIVE_THRESHOLD) label = 'positive'
  else if (normalised <= SENTIMENT_NEGATIVE_THRESHOLD) label = 'negative'

  return { score: Number(normalised.toFixed(SENTIMENT_SCORE_PRECISION)), label }
}

const FAKE_BASE_SCORE = 20
const FAKE_FLAGGED_PENALTY = 25
const FAKE_UNVERIFIED_PENALTY = 20
const FAKE_SHORT_COMMENT_LENGTH = 30
const FAKE_SHORT_COMMENT_PENALTY = 20
const FAKE_NO_HELPFUL_PENALTY = 10
const FAKE_EXTREME_RATING_PENALTY = 10
const FAKE_EXTREME_LOW_RATING = 2
const FAKE_EXTREME_HIGH_RATING = 5
const FAKE_RECENT_REVIEW_HOURS = 24
const FAKE_RECENT_PENALTY = 5
const MILLISECONDS_PER_HOUR = 36e5
const FAKE_HIGH_THRESHOLD = 70
const FAKE_MEDIUM_THRESHOLD = 40

export function estimateFakeLikelihood(input: FakeLikelihoodInput) {
  let score = FAKE_BASE_SCORE

  if (input.isFlagged) score += FAKE_FLAGGED_PENALTY
  if (input.isVerified === false) score += FAKE_UNVERIFIED_PENALTY
  if (input.commentLength < FAKE_SHORT_COMMENT_LENGTH) score += FAKE_SHORT_COMMENT_PENALTY
  if ((input.helpfulCount ?? 0) === 0) score += FAKE_NO_HELPFUL_PENALTY
  if (input.rating !== null) {
    if (input.rating <= FAKE_EXTREME_LOW_RATING || input.rating >= FAKE_EXTREME_HIGH_RATING) score += FAKE_EXTREME_RATING_PENALTY
  }
  if (input.createdAt) {
    const created = new Date(input.createdAt)
    const now = Date.now()
    const diffHours = Math.abs(now - created.getTime()) / MILLISECONDS_PER_HOUR
    if (diffHours < FAKE_RECENT_REVIEW_HOURS) score += FAKE_RECENT_PENALTY
  }

  const finalScore = clamp(Math.round(score), 0, 100)
  const label: 'high' | 'medium' | 'low' =
    finalScore >= FAKE_HIGH_THRESHOLD ? 'high' : finalScore >= FAKE_MEDIUM_THRESHOLD ? 'medium' : 'low'

  return { score: finalScore, label }
}

const QUALITY_BASE_SCORE = 60
const QUALITY_DETAILED_COMMENT_LENGTH = 200
const QUALITY_SHORT_COMMENT_LENGTH = 40
const QUALITY_DETAILED_BONUS = 10
const QUALITY_SHORT_PENALTY = 15
const QUALITY_HELPFUL_THRESHOLD = 3
const QUALITY_HELPFUL_BONUS = 10
const QUALITY_NO_HELPFUL_PENALTY = 5
const QUALITY_RESPONSE_BONUS = 5
const QUALITY_FLAGGED_PENALTY = 20
const QUALITY_SENTIMENT_MULTIPLIER = 10
const QUALITY_HIGH_THRESHOLD = 75
const QUALITY_MEDIUM_THRESHOLD = 50

export function calculateQualityScore(input: QualityScoreInput) {
  let score = QUALITY_BASE_SCORE

  if (input.commentLength > QUALITY_DETAILED_COMMENT_LENGTH) score += QUALITY_DETAILED_BONUS
  else if (input.commentLength < QUALITY_SHORT_COMMENT_LENGTH) score -= QUALITY_SHORT_PENALTY

  if ((input.helpfulCount ?? 0) > QUALITY_HELPFUL_THRESHOLD) score += QUALITY_HELPFUL_BONUS
  else if ((input.helpfulCount ?? 0) === 0) score -= QUALITY_NO_HELPFUL_PENALTY

  if (input.hasResponse) score += QUALITY_RESPONSE_BONUS
  if (input.isFlagged) score -= QUALITY_FLAGGED_PENALTY

  score += input.sentimentScore * QUALITY_SENTIMENT_MULTIPLIER

  const finalScore = clamp(Math.round(score), 0, 100)
  const label: 'high' | 'medium' | 'low' =
    finalScore >= QUALITY_HIGH_THRESHOLD ? 'high' : finalScore >= QUALITY_MEDIUM_THRESHOLD ? 'medium' : 'low'

  return { score: finalScore, label }
}

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
