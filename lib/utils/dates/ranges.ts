import type { DateRange, DateRanges } from './types'

function formatRange(start: Date, end: Date): DateRange {
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function getDateRanges(referenceDate: Date = new Date()): DateRanges {
  const now = new Date(referenceDate)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  const endOfWeek = endOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6))

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0))

  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const endOfYear = endOfDay(new Date(now.getFullYear(), 11, 31))

  return {
    today: formatRange(startOfToday, endOfDay(startOfToday)),
    week: formatRange(startOfWeek, endOfWeek),
    month: formatRange(startOfMonth, endOfMonth),
    year: formatRange(startOfYear, endOfYear),
  }
}

export function getToday(): DateRange {
  return getDateRanges().today
}

export function getWeek(): DateRange {
  return getDateRanges().week
}

export function getMonth(): DateRange {
  return getDateRanges().month
}

export function getYear(): DateRange {
  return getDateRanges().year
}

export function getLastNDays(days: number, referenceDate: Date = new Date()): DateRange {
  const now = new Date(referenceDate)
  const start = new Date(now)
  start.setDate(start.getDate() - days)
  start.setHours(0, 0, 0, 0)

  return formatRange(start, endOfDay(now))
}

export function getDateRange(date: Date): DateRange {
  const normalized = new Date(date)
  const start = new Date(normalized.getFullYear(), normalized.getMonth(), normalized.getDate())
  return formatRange(start, endOfDay(start))
}
