import { DATE_FORMATS, type DateFormatKey } from './constants'
import { parseDate } from './parse'

type IntlPatternMap = Record<string, Intl.DateTimeFormatOptions>

type FormatOptions = {
  fallback?: string
}

const PATTERN_MAP: IntlPatternMap = {
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
    hour12: true,
  },
  'MMMM yyyy': { month: 'long', year: 'numeric' },
  'MMM yyyy': { month: 'short', year: 'numeric' },
}

export function formatDate(
  date: string | Date | null | undefined,
  formatKey: DateFormatKey | string = 'short',
  fallback: string = 'Date TBD',
): string {
  const parsed = parseDate(date)
  if (!parsed) return fallback

  try {
    const formatString = formatKey in DATE_FORMATS
      ? DATE_FORMATS[formatKey as DateFormatKey]
      : formatKey

    return formatWithIntl(parsed, formatString, { fallback })
  } catch (error) {
    console.error('Date formatting error:', error)
    return fallback
  }
}

function formatWithIntl(date: Date, pattern: string, options: FormatOptions): string {
  const intlOptions = PATTERN_MAP[pattern]
  if (intlOptions) {
    return new Intl.DateTimeFormat('en-US', intlOptions).format(date)
  }

  if (pattern === DATE_FORMATS.iso) {
    return date.toISOString()
  }

  if (pattern === DATE_FORMATS.date) {
    return date.toISOString().split('T')[0]
  }

  return options.fallback ?? date.toISOString()
}

export function formatAppointmentDate(date: string | Date | null | undefined): string {
  return formatDate(date, 'short', 'Date TBD')
}

export function formatAppointmentTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'time', 'Time TBD')
}

export function formatAppointmentDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'datetime', 'Date & Time TBD')
}

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
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${prefix}${weeks} week${weeks !== 1 ? 's' : ''}${suffix}`
  }

  return formatDate(date, 'short')
}

export { DATE_FORMATS }
export type { DateFormatKey }
