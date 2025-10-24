import { parseISO } from 'date-fns'
import type {
  AppointmentRow,
  AppointmentSnapshot,
  AppointmentStatusTotals,
  AppointmentTrendPoint,
  CancellationPattern,
} from './types'

const ZERO_TOTALS: AppointmentStatusTotals = {
  total: 0,
  completed: 0,
  cancelled: 0,
  noShow: 0,
  inProgress: 0,
  upcoming: 0,
}

const getDayLabel = (value: Date) => value.toLocaleDateString('en-US', { weekday: 'long' })

const getTimeBucket = (value: Date) => {
  const hour = value.getHours()
  if (hour < 6) return 'Overnight'
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  if (hour < 21) return 'Evening'
  return 'Late Night'
}

export const buildStatusTotals = (rows: AppointmentRow[]): AppointmentStatusTotals => {
  if (!rows.length) return { ...ZERO_TOTALS }

  return rows.reduce((acc, row) => {
    acc.total += 1
    const status = row.status ?? 'pending'

    if (status === 'completed') acc.completed += 1
    else if (status === 'cancelled') acc.cancelled += 1
    else if (status === 'no_show') acc.noShow += 1
    else if (status === 'in_progress' || status === 'checked_in') acc.inProgress += 1

    const startTime = row.start_time ? parseISO(row.start_time) : null
    if (startTime && startTime > new Date() && !['cancelled', 'no_show'].includes(status)) {
      acc.upcoming += 1
    }

    return acc
  }, { ...ZERO_TOTALS })
}

export const calculatePerformanceMetrics = (
  totals: AppointmentStatusTotals,
  rows: AppointmentRow[],
): AppointmentSnapshot['performance'] => {
  const completedRevenue = rows
    .filter((row) => row.status === 'completed' && typeof row.total_price === 'number')
    .reduce((acc, row) => acc + (row.total_price || 0), 0)

  const averageDuration = rows.length
    ? rows.reduce((acc, row) => acc + (row.duration_minutes || 0), 0) / rows.length
    : 0

  const completionRate = totals.total ? totals.completed / totals.total : 0
  const cancellationRate = totals.total ? totals.cancelled / totals.total : 0
  const noShowRate = totals.total ? totals.noShow / totals.total : 0
  const averageTicket = totals.completed ? completedRevenue / totals.completed : 0

  return {
    completionRate,
    cancellationRate,
    noShowRate,
    averageDuration,
    totalRevenue: completedRevenue,
    averageTicket,
  }
}

export const buildCancellationPatterns = (
  rows: AppointmentRow[],
): CancellationPattern[] => {
  const cancelled = rows.filter((row) => row.status === 'cancelled' && row.start_time)
  if (!cancelled.length) return []

  const patternMap = new Map<string, { count: number; description: string }>()

  cancelled.forEach((row) => {
    const start = parseISO(row.start_time as string)
    const label = `${getDayLabel(start)} · ${getTimeBucket(start)}`
    const description = `Cancellations during ${getTimeBucket(start).toLowerCase()} on ${getDayLabel(start)}`
    const existing = patternMap.get(label)
    patternMap.set(label, {
      count: existing ? existing.count + 1 : 1,
      description,
    })
  })

  const totalCancelled = cancelled.length

  return Array.from(patternMap.entries())
    .map(([label, value]) => ({
      label,
      count: value.count,
      share: totalCancelled ? value.count / totalCancelled : 0,
      description: value.description,
    }))
    .sort((a, b) => b.count - a.count)
}

export const buildTrend = <T extends {
  date: string | null
  platform_appointments: number | null
  platform_cancelled_appointments: number | null
  platform_no_shows: number | null
  platform_completed_appointments: number | null
}>(
  analyticsRows: T[],
): AppointmentTrendPoint[] =>
  analyticsRows
    .filter((row) => row.date)
    .map((row) => ({
      date: row.date as string,
      total: row.platform_appointments ?? 0,
      cancelled: row.platform_cancelled_appointments ?? 0,
      noShow: row.platform_no_shows ?? 0,
      completed: row.platform_completed_appointments ?? 0,
    }))
    .reverse()
