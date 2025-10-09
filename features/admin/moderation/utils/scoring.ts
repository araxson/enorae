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

  let label: SentimentLabel = 'neutral'
  if (normalised >= 0.15) label = 'positive'
  else if (normalised <= -0.15) label = 'negative'

  return { score: Number(normalised.toFixed(3)), label }
}

export function estimateFakeLikelihood(input: FakeLikelihoodInput) {
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
  const label = finalScore >= 70 ? 'high' : finalScore >= 40 ? 'medium' : 'low'

  return { score: finalScore, label as 'high' | 'medium' | 'low' }
}

export function calculateQualityScore(input: QualityScoreInput) {
  let score = 60

  if (input.commentLength > 200) score += 10
  else if (input.commentLength < 40) score -= 15

  if ((input.helpfulCount ?? 0) > 3) score += 10
  else if ((input.helpfulCount ?? 0) === 0) score -= 5

  if (input.hasResponse) score += 5
  if (input.isFlagged) score -= 20

  score += input.sentimentScore * 10

  const finalScore = clamp(Math.round(score), 0, 100)
  const label = finalScore >= 75 ? 'high' : finalScore >= 50 ? 'medium' : 'low'

  return { score: finalScore, label as 'high' | 'medium' | 'low' }
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
