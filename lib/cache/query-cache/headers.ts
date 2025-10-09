export function getCacheHeaders(config: {
  maxAge?: number
  staleWhileRevalidate?: number
  public?: boolean
}) {
  const { maxAge = 60, staleWhileRevalidate = 300, public: isPublic = false } = config

  const directives = [
    isPublic ? 'public' : 'private',
    `max-age=${maxAge}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
  ]

  return {
    'Cache-Control': directives.join(', '),
  }
}

export const CACHE_HEADERS = {
  DASHBOARD: getCacheHeaders({ maxAge: 60, staleWhileRevalidate: 300 }),
  METRICS: getCacheHeaders({ maxAge: 30, staleWhileRevalidate: 120 }),
  USER_DATA: getCacheHeaders({ maxAge: 300, staleWhileRevalidate: 900 }),
  STATIC: getCacheHeaders({ maxAge: 3600, staleWhileRevalidate: 86400, public: true }),
  NO_CACHE: {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  },
} as const
