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
  /** Customer lifetime value projection period in years */
  LTV_PROJECTION_YEARS: 3,
  /** Days in a year for frequency calculations */
  DAYS_PER_YEAR: 365,
  /** Batch size for profile fetching */
  PROFILE_FETCH_BATCH_SIZE: 500,
  /** Top customers to display in insights */
  TOP_CUSTOMERS_LIMIT: 5,
  /** Default average service price for lifetime value estimation (USD) */
  DEFAULT_AVERAGE_SERVICE_PRICE: 75,
  /** Percentage multiplier for rate calculations */
  PERCENTAGE_MULTIPLIER: 100,
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
 * Time Conversion Constants
 */
export const TIME_CONVERSIONS = {
  /** Milliseconds in one second */
  MS_PER_SECOND: 1000,
  /** Seconds in one minute */
  SECONDS_PER_MINUTE: 60,
  /** Minutes in one hour */
  MINUTES_PER_HOUR: 60,
  /** Hours in one day */
  HOURS_PER_DAY: 24,
  /** Milliseconds in one minute */
  MS_PER_MINUTE: 60000,
  /** Milliseconds in one hour */
  MS_PER_HOUR: 3600000,
  /** Milliseconds in one day */
  MS_PER_DAY: 86400000,

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

/**
 * UI Interaction Timeouts (in milliseconds)
 */
export const UI_TIMEOUTS = {
  /** Debounce delay for search inputs - 300ms */
  SEARCH_DEBOUNCE: 300,
  /** Debounce delay for general inputs - 500ms */
  INPUT_DEBOUNCE: 500,
  /** Navigation transition delay - 500ms */
  NAVIGATION_DELAY: 500,
  /** Loading state minimum duration - 300ms */
  MIN_LOADING_DURATION: 300,
  /** Copy feedback timeout - 2 seconds */
  COPY_FEEDBACK: 2000,
  /** Validation simulation delay - 1 second */
  VALIDATION_SIMULATION: 1000,
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

/**
 * Date Range Presets (in days)
 */
export const DATE_RANGES = {
  /** Last 7 days */
  WEEK: 7,
  /** Last 30 days */
  MONTH: 30,
  /** Last 90 days */
  QUARTER: 90,
  /** Last 365 days */
  YEAR: 365,
  /** Future week (7 days ahead) */
  NEXT_WEEK: 7,
  /** Future month (30 days ahead) */
  NEXT_MONTH: 30,
  /** Future quarter (90 days ahead) */
  NEXT_QUARTER: 90,
} as const

/**
 * Performance Thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  /** Query execution time threshold (ms) - queries slower than this are considered slow */
  SLOW_QUERY_MS: 500,
  /** Price threshold for revenue scoring */
  REVENUE_SCORE_DIVISOR: 500,
} as const

/**
 * Customer Churn Risk Analysis Thresholds
 */
export const CHURN_RISK_THRESHOLDS = {
  /** Days threshold for long time since last visit */
  LONG_TIME_SINCE_VISIT_DAYS: 90,
  /** Multiplier for overdue return visit detection */
  OVERDUE_VISIT_MULTIPLIER: 2,
  /** Multiplier for approaching return window */
  APPROACHING_RETURN_MULTIPLIER: 1.5,
  /** High cancellation rate threshold */
  HIGH_CANCELLATION_RATE: 0.3,
  /** Moderate cancellation rate threshold */
  MODERATE_CANCELLATION_RATE: 0.15,
  /** High no-show rate threshold */
  HIGH_NO_SHOW_RATE: 0.2,
  /** Moderate no-show rate threshold */
  MODERATE_NO_SHOW_RATE: 0.1,
  /** Minimum visits for frequency analysis */
  MIN_VISITS_FOR_FREQUENCY: 3,
  /** Frequency decline threshold multiplier */
  FREQUENCY_DECLINE_MULTIPLIER: 1.3,
  /** Risk score thresholds */
  CRITICAL_RISK_SCORE: 70,
  HIGH_RISK_SCORE: 50,
  MEDIUM_RISK_SCORE: 30,
  /** Risk score values for factors */
  OVERDUE_RETURN_SCORE: 30,
  APPROACHING_RETURN_SCORE: 20,
  LONG_TIME_SCORE: 25,
  HIGH_CANCELLATION_SCORE: 25,
  MODERATE_CANCELLATION_SCORE: 15,
  HIGH_NO_SHOW_SCORE: 20,
  MODERATE_NO_SHOW_SCORE: 10,
  FREQUENCY_DECLINE_SCORE: 15,
  LOW_VISITS_SCORE: 10,
} as const

/**
 * API Retry Configuration
 */
export const RETRY_CONFIG = {
  /** Default number of retry attempts for failed API calls */
  DEFAULT_ATTEMPTS: 3,
  /** Base delay between retries in milliseconds */
  BASE_DELAY_MS: 150,
  /** Exponential backoff multiplier */
  BACKOFF_MULTIPLIER: 1,
} as const

/**
 * Address Validation Configuration
 */
export const ADDRESS_VALIDATION = {
  /** Minimum score for valid address (0-100) */
  VALID_THRESHOLD: 70,
  /** Minimum score for acceptable address (0-100) */
  ACCEPTABLE_THRESHOLD: 50,
  /** Score penalties for missing fields */
  PENALTIES: {
    MISSING_STREET: 30,
    MISSING_CITY: 20,
    MISSING_STATE: 20,
    MISSING_POSTAL_CODE: 15,
    MISSING_COORDINATES: 10,
    MISSING_FORMATTED_ADDRESS: 5,
    INVALID_POSTAL_CODE: 10,
  },
} as const

/**
 * Review and Moderation Scoring Thresholds
 */
export const MODERATION_THRESHOLDS = {
  /** Base reputation score for new reviewers with no history */
  DEFAULT_REPUTATION_SCORE: 50,
  /** Minimum reviews before full reputation calculation */
  MIN_REVIEWS_FOR_REPUTATION: 3,
  /** Reputation score penalty for low review count */
  LOW_REVIEW_COUNT_PENALTY: 10,
  /** Reputation score threshold for trusted status */
  TRUSTED_REPUTATION_THRESHOLD: 70,
  /** Reputation score threshold for risky status */
  RISKY_REPUTATION_THRESHOLD: 40,
  /** Initial base reputation score calculation */
  REPUTATION_BASE_SCORE: 80,

  /** Base quality score for reviews */
  BASE_QUALITY_SCORE: 60,
  /** Quality score bonus for detailed reviews (>200 chars) */
  DETAILED_REVIEW_BONUS: 10,
  /** Quality score penalty for short reviews (<40 chars) */
  SHORT_REVIEW_PENALTY: 15,
  /** Review length threshold for detailed bonus */
  DETAILED_REVIEW_LENGTH: 200,
  /** Review length threshold for short penalty */
  SHORT_REVIEW_LENGTH: 40,
  /** Quality score bonus for highly helpful reviews (>3 votes) */
  HELPFUL_REVIEW_BONUS: 10,
  /** Helpful vote threshold for bonus */
  HELPFUL_VOTE_THRESHOLD: 3,
  /** Quality score penalty for unhelpful reviews (0 votes) */
  UNHELPFUL_REVIEW_PENALTY: 5,
  /** Quality score bonus for responded reviews */
  RESPONDED_REVIEW_BONUS: 5,
  /** Quality score penalty for flagged reviews */
  FLAGGED_REVIEW_PENALTY: 20,
  /** Sentiment score multiplier for quality calculation */
  SENTIMENT_SCORE_MULTIPLIER: 10,
  /** High quality score threshold */
  HIGH_QUALITY_THRESHOLD: 75,
  /** Medium quality score threshold */
  MEDIUM_QUALITY_THRESHOLD: 50,
} as const
