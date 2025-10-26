/**
 * Comprehensive formatting utilities for the ENORAE application
 * Consolidates all currency, number, date, and data formatting functions
 */

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
    return '$0.00'
  }

  const {
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

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
  const { decimals = 1, includeSign = false } = options
  const sign = includeSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Number formatting with abbreviations (1K, 1M, etc.)
 */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toString()
}

/**
 * Duration formatting (minutes to hours/minutes)
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

/**
 * Growth rate calculation
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Format date for analytics display
 */
export function formatAnalyticsDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

/**
 * Format large numbers with commas (e.g., 1,234,567)
 */
export function formatNumberWithCommas(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Format revenue with proper currency symbol and abbreviation
 */
export function formatRevenue(amount: number | null | undefined): string {
  return formatCurrency(amount, {
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
