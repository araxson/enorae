/**
 * Cache Duration Constants
 *
 * Cache durations for different data types in seconds.
 */

/**
 * Cache Duration (in seconds)
 */
export const CACHE_DURATION = {
  /** Dashboard data cache - 1 minute */
  DASHBOARD: 60,
  /** Metrics data cache - 30 seconds */
  METRICS: 30,
  /** User data cache - 5 minutes */
  USER_DATA: 300,
  /** Static content cache - 1 hour */
  STATIC: 3600,
  /** Stale while revalidate - 5 minutes */
  SWR_DEFAULT: 300,
  /** Stale while revalidate for metrics - 2 minutes */
  SWR_METRICS: 120,
  /** Stale while revalidate for user data - 15 minutes */
  SWR_USER_DATA: 900,
  /** Stale while revalidate for static - 24 hours */
  SWR_STATIC: 86400,
} as const
