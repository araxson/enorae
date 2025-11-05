/**
 * Business Logic Thresholds and Performance Metrics
 *
 * Business rules, thresholds, and performance metrics for the application.
 */

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
 * Performance Thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  /** Query execution time threshold (ms) - queries slower than this are considered slow */
  SLOW_QUERY_MS: 500,
  /** Price threshold for revenue scoring */
  REVENUE_SCORE_DIVISOR: 500,
} as const
