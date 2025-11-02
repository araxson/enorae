/**
 * Simple In-Memory Rate Limiter
 *
 * For production multi-instance deployments, consider using:
 * - Upstash Redis (@upstash/ratelimit)
 * - Vercel KV
 * - Redis Cloud
 *
 * This in-memory implementation works for:
 * - Single-instance deployments
 * - Development/testing
 * - Low-traffic applications
 */

import { TIME_MS } from '@/lib/config/constants'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const allowInMemoryRateLimiter = process.env['ALLOW_IN_MEMORY_RATE_LIMIT'] === 'true'
let inMemoryLimiterWarningShown = false

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {
    if (process.env.NODE_ENV === 'production' && !allowInMemoryRateLimiter) {
      throw new Error(
        'In-memory rate limiting is not allowed in production. Configure a distributed rate limiter (e.g. Upstash, Redis) or explicitly set ALLOW_IN_MEMORY_RATE_LIMIT=true to override for testing.'
      )
    }

    if (!inMemoryLimiterWarningShown && process.env.NODE_ENV !== 'production') {
      console.warn(
        '[rate-limit] Using in-memory rate limiter. Configure ALLOW_IN_MEMORY_RATE_LIMIT=false with a distributed backend before deploying to production.'
      )
      inMemoryLimiterWarningShown = true
    }

    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, TIME_MS.ONE_MINUTE)
  }

  async limit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now()
    const entry = this.store.get(identifier)

    // If no entry or expired, create new
    if (!entry || now > entry.resetAt) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetAt: now + this.windowMs,
      }
      this.store.set(identifier, newEntry)

      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: newEntry.resetAt,
      }
    }

    // Check if already exceeded BEFORE incrementing (prevents race condition)
    if (entry.count >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: entry.resetAt,
      }
    }

    // Increment counter atomically
    entry.count++

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - entry.count,
      reset: entry.resetAt,
    }
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key)
      }
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }
}

import { RATE_LIMITS } from '@/lib/config/constants'

// Rate limiters for different routes
// Auth routes: 10 requests per 10 minutes
export const authRateLimiter = new InMemoryRateLimiter(
  RATE_LIMITS.IN_MEMORY_AUTH.limit,
  RATE_LIMITS.IN_MEMORY_AUTH.windowMs
)

// API routes: 100 requests per minute
export const apiRateLimiter = new InMemoryRateLimiter(
  RATE_LIMITS.IN_MEMORY_API.limit,
  RATE_LIMITS.IN_MEMORY_API.windowMs
)
