/**
 * Application Configuration Constants
 *
 * Centralized configuration values for the ENORAE application.
 * All magic numbers, timeouts, limits, and thresholds are defined here
 * with clear documentation of their purpose and units.
 *
 * DO NOT hardcode these values elsewhere in the codebase.
 * Import from this file to maintain consistency.
 */

/**
 * Time Constants (in milliseconds)
 */
export const TIME_MS = {
  /** 1 second in milliseconds */
  ONE_SECOND: 1000,
  /** Standard UI feedback timeout - 3 seconds for success messages */
  SUCCESS_MESSAGE_TIMEOUT: 3000,
  /** Standard API request timeout - 10 seconds */
  API_REQUEST_TIMEOUT: 10000,
  /** Cleanup/update interval - 1 minute */
  ONE_MINUTE: 60000,
  /** Default hour offset for new blocked times */
  ONE_HOUR: 3600000,
} as const

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

/**
 * Rate Limiting
 */
export const RATE_LIMITS = {
  /** Dashboard endpoints - 100 requests per minute */
  DASHBOARD: {
    limit: 100,
    windowSeconds: 60,
    namespace: 'dashboard',
  },
  /** Admin endpoints - 50 requests per minute */
  ADMIN: {
    limit: 50,
    windowSeconds: 60,
    namespace: 'admin',
  },
  /** Mutation endpoints - 30 requests per minute */
  MUTATIONS: {
    limit: 30,
    windowSeconds: 60,
    namespace: 'mutations',
  },
  /** Auth endpoints - 5 requests per 15 minutes */
  AUTH: {
    limit: 5,
    windowSeconds: 15 * 60,
    namespace: 'auth',
  },
  /** In-memory rate limiter - Auth: 10 requests per 10 minutes */
  IN_MEMORY_AUTH: {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  },
  /** In-memory rate limiter - API: 100 requests per minute */
  IN_MEMORY_API: {
    limit: 100,
    windowMs: 60 * 1000,
  },
} as const

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
 * Business Logic Thresholds
 */
export const BUSINESS_THRESHOLDS = {
  /** Loyalty program tiers based on lifetime spend */
  LOYALTY_TIERS: [
    { min: 5000, tier: 'platinum' as const },
    { min: 2000, tier: 'gold' as const },
    { min: 500, tier: 'silver' as const },
    { min: 0, tier: 'bronze' as const },
  ],
  /** Loyalty points divisor - $1 = 0.1 points */
  LOYALTY_POINTS_DIVISOR: 10,
  /** Revenue score calculation - max revenue threshold */
  REVENUE_SCORE_MAX: 150000,
  /** Minimum salon name similarity threshold for search suggestions */
  SALON_SEARCH_SIMILARITY_THRESHOLD: 0.1,
  /** Default estimated bookings per service for revenue forecasting */
  ESTIMATED_BOOKINGS_PER_SERVICE: 25,
  /** Maximum advance booking hours limit */
  MAX_ADVANCE_BOOKING_HOURS: 720,
  /** Maximum advance booking days limit */
  MAX_ADVANCE_BOOKING_DAYS: 365,
  /** Default minimum advance booking hours if not specified */
  DEFAULT_MIN_ADVANCE_BOOKING_HOURS: 1,
  /** Default maximum advance booking days if not specified */
  DEFAULT_MAX_ADVANCE_BOOKING_DAYS: 90,
  /** Default service name max length */
  SERVICE_NAME_MAX_LENGTH: 120,
  /** Default service description max length */
  SERVICE_DESCRIPTION_MAX_LENGTH: 2000,
  /** Currency code length (ISO 4217 standard) */
  CURRENCY_CODE_LENGTH: 3,
  /** Maximum tax rate percentage */
  MAX_TAX_RATE_PERCENT: 100,
  /** Maximum commission rate percentage */
  MAX_COMMISSION_RATE_PERCENT: 100,
  /** Hours in a day for booking calculations */
  HOURS_IN_DAY: 24,
} as const

/**
 * Analytics and Metrics Configuration
 */
export const ANALYTICS_CONFIG = {
  /** Number of days to compare in period-over-period analysis */
  PERIOD_COMPARISON_DAYS: 7,
  /** Default forecast horizon in days for revenue predictions */
  REVENUE_FORECAST_HORIZON_DAYS: 7,
  /** Minimum search term length for suggestions */
  MIN_SEARCH_TERM_LENGTH: 2,
  /** Default limit for search suggestions */
  DEFAULT_SEARCH_SUGGESTIONS_LIMIT: 5,
  /** Decimal places for price rounding */
  PRICE_DECIMAL_PLACES: 2,
  /** Default chunk size for batch processing */
  DEFAULT_BATCH_CHUNK_SIZE: 100,
} as const

/**
 * External URLs and Social Media
 *
 * Note: These are ENORAE platform social media links.
 * Individual salon/user social media links come from database.
 */
export const PLATFORM_SOCIAL_URLS = {
  twitter: 'https://twitter.com/enorae',
  facebook: 'https://facebook.com/enorae',
  instagram: 'https://instagram.com/enorae',
  linkedin: 'https://linkedin.com/company/enorae',
} as const

/**
 * Contact Information
 */
export const PLATFORM_CONTACT = {
  email: 'hello@enorae.com',
  support: 'support@enorae.com',
} as const

/**
 * Application Metadata
 */
export const APP_METADATA = {
  name: 'Enorae',
  version: '1.0.0',
  description:
    'Modern salon booking platform with role-based portals for customers, staff, business owners, and platform administrators.',
} as const

/**
 * Schema.org and SEO
 */
export const SEO_CONSTANTS = {
  /** Default image for salons without uploaded images */
  DEFAULT_SALON_IMAGE: '/default-salon.png',
  /** Rating scale for aggregate ratings */
  RATING_SCALE: {
    best: 5,
    worst: 1,
  },
  /** Default price range if not specified */
  DEFAULT_PRICE_RANGE: '$$',
} as const

/**
 * Social Media Platforms Configuration
 * Used for form placeholders and validation
 */
export const SOCIAL_MEDIA_PLATFORMS = [
  {
    id: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/yourprofile',
    icon: 'Facebook',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/yourprofile',
    icon: 'Instagram',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    placeholder: 'https://twitter.com/yourprofile',
    icon: 'Twitter',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/yourprofile',
    icon: 'Linkedin',
  },
] as const

/**
 * Time Conversion Utilities
 */
export const TIME_CONVERSIONS = {
  /** Convert minutes to milliseconds */
  minutesToMs: (minutes: number) => minutes * 60 * 1000,
  /** Convert seconds to milliseconds */
  secondsToMs: (seconds: number) => seconds * 1000,
  /** Convert hours to milliseconds */
  hoursToMs: (hours: number) => hours * 60 * 60 * 1000,
  /** Convert days to milliseconds */
  daysToMs: (days: number) => days * 24 * 60 * 60 * 1000,
  /** Convert milliseconds to minutes */
  msToMinutes: (ms: number) => Math.floor(ms / 60000),
} as const
