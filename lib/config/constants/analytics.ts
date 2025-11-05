/**
 * Analytics and Customer Insights Configuration
 *
 * Configuration for analytics calculations, customer insights, and churn prediction.
 */

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
