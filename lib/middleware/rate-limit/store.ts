import type { RateLimitStore } from './types'

const store: RateLimitStore = {}

const CLEANUP_INTERVAL = 5 * 60 * 1000

setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, CLEANUP_INTERVAL)

export function getRateLimitEntry(key: string, windowMs: number) {
  const now = Date.now()
  if (!store[key] || store[key].resetTime < now) {
    store[key] = { count: 0, resetTime: now + windowMs }
  }
  return store[key]
}
