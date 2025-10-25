import type { RateLimitStore } from './types'

const store: RateLimitStore = {}

const CLEANUP_INTERVAL = 5 * 60 * 1000

setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    const entry = store[key]
    if (entry && entry.resetTime < now) {
      delete store[key]
    }
  })
}, CLEANUP_INTERVAL)

export function getRateLimitEntry(key: string, windowMs: number) {
  const now = Date.now()
  const existing = store[key]

  if (!existing || existing.resetTime < now) {
    const nextEntry = { count: 0, resetTime: now + windowMs }
    store[key] = nextEntry
    return nextEntry
  }

  return existing
}
