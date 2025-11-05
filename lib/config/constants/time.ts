/**
 * Time Constants and Conversions
 *
 * Centralized time-related constants for consistent time calculations
 * across the application.
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
