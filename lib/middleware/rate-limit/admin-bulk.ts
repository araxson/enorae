const WINDOW_MS = 60 * 1000
const DEFAULT_LIMIT = 10

const tracker = new Map<string, number[]>()

export function enforceAdminBulkRateLimit(userId: string, action: string, limit = DEFAULT_LIMIT, windowMs = WINDOW_MS): void {
  const key = `${userId}:${action}`
  const now = Date.now()
  const timestamps = tracker.get(key)?.filter((timestamp) => now - timestamp < windowMs) ?? []

  if (timestamps.length >= limit) {
    throw new Error('Rate limit exceeded for this admin action. Please wait a moment and try again.')
  }

  timestamps.push(now)
  tracker.set(key, timestamps)
}
