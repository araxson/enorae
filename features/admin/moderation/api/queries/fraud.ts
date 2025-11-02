import 'server-only'

import { createOperationLogger } from '@/lib/observability/logger'
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
  let score = 20

  if (input.isFlagged) score += 25
  if (input.isVerified === false) score += 20
  if (input.commentLength < 30) score += 20
  if ((input.helpfulCount ?? 0) === 0) score += 10
  if (input['rating'] !== null) {
    if (input['rating'] <= 2 || input['rating'] >= 5) score += 10
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
