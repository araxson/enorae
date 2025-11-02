/**
 * Comprehensive formatting utilities for the ENORAE application
 * Consolidates all currency, number, date, and data formatting functions
 */

const DEFAULT_CURRENCY = 'USD'
const DEFAULT_CURRENCY_LOCALE = 'en-US'
const DEFAULT_MIN_FRACTION_DIGITS = 2
const DEFAULT_MAX_FRACTION_DIGITS = 2
const DEFAULT_CURRENCY_DISPLAY = '$0.00'

/**
 * Currency formatting with configurable options
 * Handles null/undefined values and various locales
 */
export function formatCurrency(
  amount: number | null | undefined,
  options: {
    currency?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  } = {}
): string {
  if (amount === null || amount === undefined) {
    return DEFAULT_CURRENCY_DISPLAY
  }

  const {
    currency = DEFAULT_CURRENCY,
    minimumFractionDigits = DEFAULT_MIN_FRACTION_DIGITS,
    maximumFractionDigits = DEFAULT_MAX_FRACTION_DIGITS,
  } = options

  return new Intl.NumberFormat(DEFAULT_CURRENCY_LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

const DEFAULT_PERCENTAGE_DECIMALS = 1
const POSITIVE_SIGN = '+'
const EMPTY_SIGN = ''

/**
 * Percentage formatting with optional sign and decimal places
 */
export function formatPercentage(
  value: number,
  options: {
    decimals?: number
    includeSign?: boolean
  } = {}
): string {
  const { decimals = DEFAULT_PERCENTAGE_DECIMALS, includeSign = false } = options
  const sign = includeSign && value > 0 ? POSITIVE_SIGN : EMPTY_SIGN
  return `${sign}${value.toFixed(decimals)}%`
}

const THOUSAND = 1_000
const MILLION = 1_000_000
const DECIMAL_PLACES_FOR_ABBREVIATION = 1

/**
 * Number formatting with abbreviations (1K, 1M, etc.)
 */
export function formatNumber(value: number): string {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(DECIMAL_PLACES_FOR_ABBREVIATION)}M`
  }
  if (value >= THOUSAND) {
    return `${(value / THOUSAND).toFixed(DECIMAL_PLACES_FOR_ABBREVIATION)}K`
  }
  return value.toString()
}

const MINUTES_PER_HOUR = 60

/**
 * Duration formatting (minutes to hours/minutes)
 */
export function formatDuration(minutes: number): string {
  if (minutes < MINUTES_PER_HOUR) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / MINUTES_PER_HOUR)
  const remainingMinutes = minutes % MINUTES_PER_HOUR
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

const PERCENTAGE_MULTIPLIER = 100
const ZERO_GROWTH_RATE = 0
const FULL_GROWTH_RATE = 100

/**
 * Growth rate calculation
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? FULL_GROWTH_RATE : ZERO_GROWTH_RATE
  return ((current - previous) / previous) * PERCENTAGE_MULTIPLIER
}

/**
 * Format date for analytics display
 */
export function formatAnalyticsDate(date: string | Date): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObject)
}

/**
 * Format large numbers with commas (e.g., 1,234,567)
 */
export function formatNumberWithCommas(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

const REVENUE_MIN_FRACTION_DIGITS = 0
const REVENUE_MAX_FRACTION_DIGITS = 0

/**
 * Format revenue with proper currency symbol and abbreviation
 */
export function formatRevenue(amount: number | null | undefined): string {
  return formatCurrency(amount, {
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: REVENUE_MIN_FRACTION_DIGITS,
    maximumFractionDigits: REVENUE_MAX_FRACTION_DIGITS,
  })
}
