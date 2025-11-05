import { headers } from 'next/headers'

/**
 * Simple in-memory rate limiter for Server Actions
 *
 * NOTE: This is a basic implementation suitable for single-server deployments.
 * For production with multiple servers, use Redis or a distributed cache.
 */

type RateLimitRecord = {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) {
        rateLimitMap.delete(key)
      }
    }
  }, 300000)
}

export type RateLimitOptions = {
  identifier: string
  limit?: number
  windowMs?: number
}

export type RateLimitResult = {
  success: boolean
  remaining?: number
  resetAt?: number
  error?: string
}

/**
 * Rate limit a Server Action by identifier (usually IP address)
 *
 * @param options - Rate limit configuration
 * @returns Result indicating whether the request should be allowed
 */
export async function rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { identifier, limit = 5, windowMs = 60000 } = options
  const now = Date.now()

  // Get existing record
  const record = rateLimitMap.get(identifier)

  // Clean up expired entry
  if (record && now > record.resetAt) {
    rateLimitMap.delete(identifier)
  }

  const current = rateLimitMap.get(identifier)

  // First request in window
  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  // Limit exceeded
  if (current.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: current.resetAt,
      error: `Too many requests. Please try again in ${Math.ceil((current.resetAt - now) / 60000)} minute(s).`,
    }
  }

  // Increment counter
  current.count++
  return { success: true, remaining: limit - current.count }
}

/**
 * Get client identifier from request headers (IP address)
 * Falls back to 'unknown' if IP cannot be determined
 */
export async function getClientIdentifier(): Promise<string> {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = forwardedFor.split(',')
    return ips[0]?.trim() || 'unknown'
  }

  if (realIp) {
    return realIp.trim()
  }

  return 'unknown'
}

/**
 * Create a rate limit identifier for a specific action and IP
 */
export function createRateLimitKey(action: string, ip: string): string {
  return `${action}:${ip}`
}
