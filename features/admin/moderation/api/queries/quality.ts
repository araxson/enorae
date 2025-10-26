import 'server-only'

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
