import type { RateLimitConfig, RateLimitResult } from './types'
import { getRateLimitEntry } from './store'

export function checkRateLimit(config: RateLimitConfig): RateLimitResult {
  const { identifier, limit, windowSeconds, namespace = 'default' } = config
  const key = `${namespace}:${identifier}`
  const windowMs = windowSeconds * 1000

  const entry = getRateLimitEntry(key, windowMs)
  const now = Date.now()
  const allowed = entry.count < limit

  if (allowed) {
    entry.count += 1
  }

  return {
    allowed,
    remaining: Math.max(0, limit - entry.count),
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
    limit,
  }
}
