import { CACHE_DURATION } from '@/lib/config/constants'

export function getCacheHeaders(config: {
  maxAge?: number
  staleWhileRevalidate?: number
  public?: boolean
}) {
  const {
    maxAge = CACHE_DURATION.DASHBOARD,
    staleWhileRevalidate = CACHE_DURATION.SWR_DEFAULT,
    public: isPublic = false,
  } = config

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
  DASHBOARD: getCacheHeaders({
    maxAge: CACHE_DURATION.DASHBOARD,
    staleWhileRevalidate: CACHE_DURATION.SWR_DEFAULT,
  }),
  METRICS: getCacheHeaders({
    maxAge: CACHE_DURATION.METRICS,
    staleWhileRevalidate: CACHE_DURATION.SWR_METRICS,
  }),
  USER_DATA: getCacheHeaders({
    maxAge: CACHE_DURATION.USER_DATA,
    staleWhileRevalidate: CACHE_DURATION.SWR_USER_DATA,
  }),
  STATIC: getCacheHeaders({
    maxAge: CACHE_DURATION.STATIC,
    staleWhileRevalidate: CACHE_DURATION.SWR_STATIC,
    public: true,
  }),
  NO_CACHE: {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  },
} as const
