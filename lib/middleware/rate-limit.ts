/**
 * Rate Limiting Middleware
 * Prevents DoS attacks on expensive dashboard queries
 *
 * Usage:
 * - Apply to API routes and server actions
 * - Configurable limits per endpoint
 * - In-memory store (upgrade to Redis for production)
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  /**
   * Unique identifier for the client (e.g., IP address, user ID)
   */
  identifier: string

  /**
   * Maximum number of requests allowed
   */
  limit: number

  /**
   * Time window in seconds
   */
  windowSeconds: number

  /**
   * Optional namespace for different rate limit policies
   */
  namespace?: string
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean

  /**
   * Number of requests remaining in current window
   */
  remaining: number

  /**
   * Time in seconds until the rate limit resets
   */
  resetIn: number

  /**
   * Total limit for this window
   */
  limit: number
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(config: RateLimitConfig): RateLimitResult {
  const { identifier, limit, windowSeconds, namespace = 'default' } = config
  const key = `${namespace}:${identifier}`
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  // Initialize or get existing entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    }
  }

  const entry = store[key]
  const allowed = entry.count < limit

  if (allowed) {
    entry.count++
  }

  return {
    allowed,
    remaining: Math.max(0, limit - entry.count),
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
    limit,
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly resetIn: number,
    public readonly limit: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

/**
 * Rate limit decorator for server functions
 */
export function withRateLimit(config: Omit<RateLimitConfig, 'identifier'>) {
  return function <T extends (...args: unknown[]) => Promise<unknown>>(
    target: T,
    context: ClassMethodDecoratorContext
  ): T {
    return (async function (this: unknown, ...args: unknown[]) {
      // Get identifier from context (implement based on your auth system)
      // For now, using a placeholder
      const identifier = 'anonymous' // TODO: Get from session/context

      const result = checkRateLimit({
        ...config,
        identifier,
      })

      if (!result.allowed) {
        throw new RateLimitError(
          `Rate limit exceeded. Try again in ${result.resetIn} seconds.`,
          result.resetIn,
          result.limit
        )
      }

      return target.apply(this, args)
    }) as T
  }
}

/**
 * Common rate limit configurations
 */
export const RATE_LIMITS = {
  /** Dashboard queries: 100 requests per minute */
  DASHBOARD: {
    limit: 100,
    windowSeconds: 60,
    namespace: 'dashboard',
  },

  /** Admin queries: 50 requests per minute */
  ADMIN: {
    limit: 50,
    windowSeconds: 60,
    namespace: 'admin',
  },

  /** Mutations: 30 requests per minute */
  MUTATIONS: {
    limit: 30,
    windowSeconds: 60,
    namespace: 'mutations',
  },

  /** Auth operations: 5 requests per 15 minutes */
  AUTH: {
    limit: 5,
    windowSeconds: 15 * 60,
    namespace: 'auth',
  },
} as const

/**
 * Helper to apply rate limiting to server actions
 *
 * @example
 * ```ts
 * export async function createAppointment(formData: FormData) {
 *   const userId = await getUserId()
 *   await applyRateLimit(userId, RATE_LIMITS.MUTATIONS)
 *   // ... rest of function
 * }
 * ```
 */
export async function applyRateLimit(
  identifier: string,
  config: Omit<RateLimitConfig, 'identifier'>
): Promise<void> {
  const result = checkRateLimit({
    ...config,
    identifier,
  })

  if (!result.allowed) {
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${result.resetIn} seconds.`,
      result.resetIn,
      result.limit
    )
  }
}
