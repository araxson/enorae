/**
 * Query Caching Strategy
 * Time-based cache with stale-while-revalidate pattern
 * For dashboard and expensive queries
 */

import { unstable_cache } from 'next/cache'

/**
 * Cache configuration presets
 */
export const CACHE_CONFIGS = {
  /** Dashboard data: 1 minute cache, 5 minute revalidate */
  DASHBOARD: {
    revalidate: 60, // 1 minute
    tags: ['dashboard'],
  },

  /** Metrics: 30 seconds cache, 2 minute revalidate */
  METRICS: {
    revalidate: 30,
    tags: ['metrics'],
  },

  /** User data: 5 minutes cache, 15 minute revalidate */
  USER_DATA: {
    revalidate: 300, // 5 minutes
    tags: ['user-data'],
  },

  /** Salon data: 10 minutes cache, 30 minute revalidate */
  SALON_DATA: {
    revalidate: 600, // 10 minutes
    tags: ['salon-data'],
  },

  /** Static data: 1 hour cache, 24 hour revalidate */
  STATIC: {
    revalidate: 3600, // 1 hour
    tags: ['static'],
  },
} as const

/**
 * Wrap a function with caching using Next.js unstable_cache
 *
 * @example
 * ```ts
 * const getCachedMetrics = withCache(
 *   async (salonId: string) => {
 *     const supabase = await createClient()
 *     return await supabase.from('metrics').select('*').eq('salon_id', salonId)
 *   },
 *   ['metrics'],
 *   CACHE_CONFIGS.METRICS
 * )
 * ```
 */
export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyParts: string[],
  options: {
    revalidate?: number | false
    tags?: string[]
  } = {}
) {
  return unstable_cache(fn, keyParts, options)
}

/**
 * Create a cached version of a query function
 * Uses Next.js cache with automatic revalidation
 */
export function createCachedQuery<T extends (...args: never[]) => Promise<unknown>>(
  queryFn: T,
  config: {
    keyPrefix: string
    revalidate?: number
    tags?: string[]
  }
): T {
  const { keyPrefix, revalidate = 60, tags = [] } = config

  return (async (...args: Parameters<T>) => {
    const cacheKey = [keyPrefix, ...args.map((arg) => JSON.stringify(arg))]

    return unstable_cache(
      async () => {
        return queryFn(...args)
      },
      cacheKey,
      {
        revalidate,
        tags: [keyPrefix, ...tags],
      }
    )()
  }) as T
}

/**
 * Cache headers for API responses
 * Use with Route Handlers or Server Actions
 */
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

/**
 * Revalidate specific cache tags
 * Call this after mutations to invalidate cached data
 *
 * @example
 * ```ts
 * // After creating a new appointment
 * await revalidateCacheTags(['dashboard', 'metrics'])
 * ```
 */
export async function revalidateCacheTags(tags: string[]) {
  const { revalidateTag } = await import('next/cache')
  tags.forEach((tag) => revalidateTag(tag))
}

/**
 * Wrapper for mutations that automatically revalidates cache
 *
 * @example
 * ```ts
 * export const createAppointment = withRevalidation(
 *   async (data) => {
 *     // ... mutation logic
 *   },
 *   ['dashboard', 'appointments']
 * )
 * ```
 */
export function withRevalidation<T extends (...args: never[]) => Promise<unknown>>(
  mutationFn: T,
  tagsToRevalidate: string[]
): T {
  return (async (...args: Parameters<T>) => {
    const result = await mutationFn(...args)
    await revalidateCacheTags(tagsToRevalidate)
    return result
  }) as T
}

/**
 * Common cache utilities
 */
export const cacheUtils = {
  /**
   * Clear dashboard cache
   */
  clearDashboard: () => revalidateCacheTags(['dashboard']),

  /**
   * Clear metrics cache
   */
  clearMetrics: () => revalidateCacheTags(['metrics']),

  /**
   * Clear user data cache
   */
  clearUserData: () => revalidateCacheTags(['user-data']),

  /**
   * Clear salon data cache
   */
  clearSalonData: () => revalidateCacheTags(['salon-data']),

  /**
   * Clear all caches
   */
  clearAll: () =>
    revalidateCacheTags(['dashboard', 'metrics', 'user-data', 'salon-data', 'static']),
}

/**
 * Response headers for different cache strategies
 */
export const CACHE_HEADERS = {
  /** Dashboard: 1 min cache, 5 min stale */
  DASHBOARD: getCacheHeaders({ maxAge: 60, staleWhileRevalidate: 300 }),

  /** Metrics: 30s cache, 2 min stale */
  METRICS: getCacheHeaders({ maxAge: 30, staleWhileRevalidate: 120 }),

  /** User data: 5 min cache, 15 min stale */
  USER_DATA: getCacheHeaders({ maxAge: 300, staleWhileRevalidate: 900 }),

  /** Static: 1 hour cache, 24 hour stale */
  STATIC: getCacheHeaders({ maxAge: 3600, staleWhileRevalidate: 86400, public: true }),

  /** No cache */
  NO_CACHE: {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  },
} as const
