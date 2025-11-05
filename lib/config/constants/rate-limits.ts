/**
 * Rate Limiting and Retry Configuration
 *
 * Rate limits for different endpoints and retry strategies.
 */

/**
 * Rate Limiting
 */
export const RATE_LIMITS = {
  /** Dashboard endpoints - 100 requests per minute */
  DASHBOARD: {
    limit: 100,
    windowSeconds: 60,
    namespace: 'dashboard',
  },
  /** Admin endpoints - 50 requests per minute */
  ADMIN: {
    limit: 50,
    windowSeconds: 60,
    namespace: 'admin',
  },
  /** Mutation endpoints - 30 requests per minute */
  MUTATIONS: {
    limit: 30,
    windowSeconds: 60,
    namespace: 'mutations',
  },
  /** Auth endpoints - 5 requests per 15 minutes */
  AUTH: {
    limit: 5,
    windowSeconds: 15 * 60,
    namespace: 'auth',
  },
  /** In-memory rate limiter - Auth: 10 requests per 10 minutes */
  IN_MEMORY_AUTH: {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  },
  /** In-memory rate limiter - API: 100 requests per minute */
  IN_MEMORY_API: {
    limit: 100,
    windowMs: 60 * 1000,
  },
} as const

/**
 * API Retry Configuration
 */
export const RETRY_CONFIG = {
  /** Default number of retry attempts for failed API calls */
  DEFAULT_ATTEMPTS: 3,
  /** Base delay between retries in milliseconds */
  BASE_DELAY_MS: 150,
  /** Exponential backoff multiplier */
  BACKOFF_MULTIPLIER: 1,
} as const
