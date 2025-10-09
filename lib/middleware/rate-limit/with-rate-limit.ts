import { checkRateLimit } from './check-rate-limit'
import type { RateLimitConfig } from './types'
import { RateLimitError } from './errors'

export function withRateLimit(config: Omit<RateLimitConfig, 'identifier'>) {
  return function <T extends (...args: unknown[]) => Promise<unknown>>(target: T): T {
    return (async function (this: unknown, ...args: unknown[]) {
      const identifier = 'anonymous'

      const result = checkRateLimit({
        ...config,
        identifier,
      })

      if (!result.allowed) {
        throw new RateLimitError(
          `Rate limit exceeded. Try again in ${result.resetIn} seconds.`,
          result.resetIn,
          result.limit,
        )
      }

      return target.apply(this, args)
    }) as T
  }
}
