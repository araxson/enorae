import 'server-only'

import { createOperationLogger } from '@/lib/observability'
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Analyze sentiment of review text using simple word-based scoring
 */
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
