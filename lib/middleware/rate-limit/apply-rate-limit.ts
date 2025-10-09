import { checkRateLimit } from './check-rate-limit'
import type { RateLimitConfig } from './types'
import { RateLimitError } from './errors'

export async function applyRateLimit(identifier: string, config: Omit<RateLimitConfig, 'identifier'>): Promise<void> {
  const result = checkRateLimit({
    ...config,
    identifier,
  })

  if (!result.allowed) {
    throw new RateLimitError(`Rate limit exceeded. Try again in ${result.resetIn} seconds.`, result.resetIn, result.limit)
  }
}
