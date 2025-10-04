/**
 * Date Utilities
 * Shared date range calculations to avoid duplication and mutation bugs
 */

export interface DateRange {
  start: string
  end: string
}

export interface DateRanges {
  today: DateRange
  week: DateRange
  month: DateRange
  year: DateRange
}

/**
 * Get standardized date ranges for common time periods
 * All dates are returned as ISO strings for database queries
 */
export function getDateRanges(referenceDate: Date = new Date()): DateRanges {
  // Clone the reference date to avoid mutation
  const now = new Date(referenceDate)

  return {
    today: {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString(),
    },
    week: {
      start: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      ).toISOString(),
      end: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + 6,
        23,
        59,
        59,
        999
      ).toISOString(),
    },
    month: {
      start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString(),
    },
    year: {
      start: new Date(now.getFullYear(), 0, 1).toISOString(),
      end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString(),
    },
  }
}

/**
 * Get start and end of today
 */
export function getToday(): DateRange {
  return getDateRanges().today
}

/**
 * Get start and end of current week (Sunday to Saturday)
 */
export function getWeek(): DateRange {
  return getDateRanges().week
}

/**
 * Get start and end of current month
 */
export function getMonth(): DateRange {
  return getDateRanges().month
}

/**
 * Get start and end of current year
 */
export function getYear(): DateRange {
  return getDateRanges().year
}

/**
 * Get date range for last N days
 */
export function getLastNDays(days: number, referenceDate: Date = new Date()): DateRange {
  const now = new Date(referenceDate)
  const start = new Date(now)
  start.setDate(start.getDate() - days)
  start.setHours(0, 0, 0, 0)

  return {
    start: start.toISOString(),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString(),
  }
}

/**
 * Get date range for a specific date
 */
export function getDateRange(date: Date): DateRange {
  const d = new Date(date)
  return {
    start: new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString(),
    end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString(),
  }
}

// ============================================================================
// DATE FORMATTING UTILITIES
// ============================================================================

/**
 * Standard date format strings
 * Consistent across all dashboards and components
 */
export const DATE_FORMATS = {
  short: 'MMM d, yyyy',
  long: 'EEEE, MMMM d, yyyy',
  time: 'h:mm a',
  time24: 'HH:mm',
  datetime: 'MMM d, yyyy h:mm a',
  datetimeLong: 'EEEE, MMMM d, yyyy h:mm a',
  iso: "yyyy-MM-dd'T'HH:mm:ss",
  date: 'yyyy-MM-dd',
  monthYear: 'MMMM yyyy',
  shortMonthYear: 'MMM yyyy',
} as const

export type DateFormatKey = keyof typeof DATE_FORMATS

/**
 * Check if a date is valid
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Safely parse a date from string or Date object
 */
export function parseDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null

  try {
    const parsed = typeof date === 'string' ? new Date(date) : date
    return isValidDate(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * Format a date with error handling and fallbacks
 * @param date - Date string, Date object, or null/undefined
 * @param formatKey - Key from DATE_FORMATS or custom format string
 * @param fallback - Fallback string if date is invalid (default: 'Date TBD')
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatKey: DateFormatKey | string = 'short',
  fallback: string = 'Date TBD'
): string {
  const parsed = parseDate(date)
  if (!parsed) return fallback

  try {
    // Determine format string
    const formatString = formatKey in DATE_FORMATS
      ? DATE_FORMATS[formatKey as DateFormatKey]
      : formatKey

    // Use Intl.DateTimeFormat for better browser support and performance
    // This is a simplified version - you can use date-fns if needed
    return formatWithIntl(parsed, formatString)
  } catch (error) {
    console.error('Date formatting error:', error)
    return fallback
  }
}

/**
 * Format date using Intl.DateTimeFormat (lightweight alternative to date-fns)
 * Falls back to basic formatting if pattern not recognized
 */
function formatWithIntl(date: Date, pattern: string): string {
  // Common pattern mappings to Intl options
  const patternMap: Record<string, Intl.DateTimeFormatOptions> = {
    'MMM d, yyyy': { month: 'short', day: 'numeric', year: 'numeric' },
    'EEEE, MMMM d, yyyy': { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    'h:mm a': { hour: 'numeric', minute: '2-digit', hour12: true },
    'HH:mm': { hour: '2-digit', minute: '2-digit', hour12: false },
    'MMM d, yyyy h:mm a': {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    },
    'MMMM yyyy': { month: 'long', year: 'numeric' },
    'MMM yyyy': { month: 'short', year: 'numeric' },
  }

  const options = patternMap[pattern]
  if (options) {
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }

  // Fallback to ISO string if pattern not recognized
  return date.toISOString()
}

/**
 * Format appointment date (short format)
 */
export function formatAppointmentDate(date: string | Date | null | undefined): string {
  return formatDate(date, 'short', 'Date TBD')
}

/**
 * Format appointment time
 */
export function formatAppointmentTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'time', 'Time TBD')
}

/**
 * Format appointment date and time
 */
export function formatAppointmentDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'datetime', 'Date & Time TBD')
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  const parsed = parseDate(date)
  if (!parsed) return 'Unknown'

  const now = new Date()
  const diffMs = parsed.getTime() - now.getTime()
  const diffSecs = Math.floor(Math.abs(diffMs) / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  const isPast = diffMs < 0
  const prefix = isPast ? '' : 'in '
  const suffix = isPast ? ' ago' : ''

  if (diffSecs < 60) return `${prefix}${diffSecs} second${diffSecs !== 1 ? 's' : ''}${suffix}`
  if (diffMins < 60) return `${prefix}${diffMins} minute${diffMins !== 1 ? 's' : ''}${suffix}`
  if (diffHours < 24) return `${prefix}${diffHours} hour${diffHours !== 1 ? 's' : ''}${suffix}`
  if (diffDays < 7) return `${prefix}${diffDays} day${diffDays !== 1 ? 's' : ''}${suffix}`
  if (diffDays < 30) return `${prefix}${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''}${suffix}`

  return formatDate(date, 'short')
}

/**
 * Get time until/since appointment
 */
export function getAppointmentTimeStatus(startTime: string | Date | null | undefined): {
  status: 'past' | 'today' | 'upcoming' | 'unknown'
  display: string
} {
  const parsed = parseDate(startTime)
  if (!parsed) return { status: 'unknown', display: 'Unknown' }

  const now = new Date()
  const today = getToday()
  const todayStart = new Date(today.start)
  const todayEnd = new Date(today.end)

  if (parsed < now) {
    return { status: 'past', display: formatRelativeTime(startTime) }
  }

  if (parsed >= todayStart && parsed <= todayEnd) {
    return { status: 'today', display: `Today at ${formatDate(startTime, 'time')}` }
  }

  return { status: 'upcoming', display: formatRelativeTime(startTime) }
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date | null | undefined): boolean {
  const parsed = parseDate(date)
  if (!parsed) return false

  const today = new Date()
  return (
    parsed.getDate() === today.getDate() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if date is in the past
 */
export function isPast(date: string | Date | null | undefined): boolean {
  const parsed = parseDate(date)
  if (!parsed) return false
  return parsed < new Date()
}

/**
 * Check if date is in the future
 */
export function isFuture(date: string | Date | null | undefined): boolean {
  const parsed = parseDate(date)
  if (!parsed) return false
  return parsed > new Date()
}
