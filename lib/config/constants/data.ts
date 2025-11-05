/**
 * Data Limits and Constraints
 *
 * Limits for data queries, pagination, and string lengths.
 */

/**
 * Data Limits and Pagination
 */
export const DATA_LIMITS = {
  /** Maximum message content length */
  MESSAGE_MAX_LENGTH: 5000,
  /** Maximum query results for admin operations */
  ADMIN_QUERY_LIMIT: 10000,
  /** Sample limit for reviewer analytics */
  REVIEWER_SAMPLE_LIMIT: 5000,
} as const

/**
 * Database Query Limits
 */
export const QUERY_LIMITS = {
  /** Default pagination limit for lists */
  DEFAULT_LIST: 50,
  /** Small lists (dropdowns, recent items) */
  SMALL_LIST: 10,
  /** Medium lists (search results) */
  MEDIUM_LIST: 100,
  /** Large lists (admin queries, exports) */
  LARGE_LIST: 1000,
  /** Maximum admin query limit */
  ADMIN_MAX: 10000,
  /** Analytics data points */
  ANALYTICS_POINTS: 150,
  /** Message history */
  MESSAGE_HISTORY: 200,
  /** Webhook logs */
  WEBHOOK_LOGS: 100,
  /** Audit logs */
  AUDIT_LOGS: 1000,
  /** Staff list for dashboards */
  STAFF_DASHBOARD: 500,
  /** Top performers/items */
  TOP_ITEMS: 5,
  /** Suggested items */
  SUGGESTIONS: 7,
  /** Address autocomplete suggestions */
  ADDRESS_SUGGESTIONS: 5,
  /** Recent items for cards */
  RECENT_ITEMS: 20,
  /** Moderation review sample limit */
  MODERATION_SAMPLE: 500,
} as const

/**
 * String Length Limits for Validation
 */
export const STRING_LIMITS = {
  /** Short text fields (names, titles) */
  SHORT_TEXT: 120,
  /** Reason fields */
  REASON: 500,
  /** Description fields */
  DESCRIPTION: 1000,
  /** Bio fields */
  BIO: 1000,
  /** Long text fields (notes, content) */
  LONG_TEXT: 2000,
  /** Very long text fields (detailed descriptions) */
  VERY_LONG_TEXT: 5000,
  /** Minimum search term length */
  MIN_SEARCH: 2,
  /** Maximum search query length */
  SEARCH_QUERY_MAX: 100,
  /** Minimum address search length */
  ADDRESS_SEARCH_MIN: 3,
} as const
