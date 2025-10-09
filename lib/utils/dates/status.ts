import { getToday } from './ranges'
import { formatDate, formatRelativeTime } from './format'
import { parseDate } from './parse'

type AppointmentStatus = 'past' | 'today' | 'upcoming' | 'unknown'

export function getAppointmentTimeStatus(
  startTime: string | Date | null | undefined,
): {
  status: AppointmentStatus
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

export function isPast(date: string | Date | null | undefined): boolean {
  const parsed = parseDate(date)
  if (!parsed) return false
  return parsed < new Date()
}

export function isFuture(date: string | Date | null | undefined): boolean {
  const parsed = parseDate(date)
  if (!parsed) return false
  return parsed > new Date()
}
