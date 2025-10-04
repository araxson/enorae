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

interface RateLimitEntry {
  count: number
  resetAt: number
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
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

    // Increment counter
    entry.count++

    // Check if exceeded
    if (entry.count > this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: entry.resetAt,
      }
    }

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

// Rate limiters for different routes
// Auth routes: 10 requests per 10 minutes
export const authRateLimiter = new InMemoryRateLimiter(10, 10 * 60 * 1000)

// API routes: 100 requests per minute
export const apiRateLimiter = new InMemoryRateLimiter(100, 60 * 1000)
