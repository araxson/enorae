import 'server-only'
import { parseISO } from 'date-fns'
import { randomUUID } from 'node:crypto'
import type { AppointmentRow } from '@/features/admin/appointments/types'
import type {
  AppointmentTrendPoint,
  CancellationPattern,
  SalonPerformance,
} from '@/features/admin/appointments/types'

const getDayLabel = (value: Date) => value.toLocaleDateString('en-US', { weekday: 'long' })

const getTimeBucket = (value: Date) => {
  const hour = value.getHours()
  if (hour < 6) return 'Overnight'
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  if (hour < 21) return 'Evening'
  return 'Late Night'
}

export const buildCancellationPatterns = (
  rows: AppointmentRow[],
): CancellationPattern[] => {
  const cancelled = rows.filter((row) => row['status'] === 'cancelled' && row['start_time'])
  if (!cancelled.length) return []

  const patternMap = new Map<string, { count: number; description: string }>()

  cancelled.forEach((row) => {
    const start = parseISO(row['start_time'] as string)
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
    .filter((row) => row['date'])
    .map((row) => ({
      date: row['date'] as string,
      total: row.platform_appointments ?? 0,
      cancelled: row.platform_cancelled_appointments ?? 0,
      noShow: row.platform_no_shows ?? 0,
      completed: row.platform_completed_appointments ?? 0,
    }))
    .reverse()

export const buildNoShowRecords = (rows: AppointmentRow[]) => {
  const noShows = rows.filter((row) => row.status === 'no_show')
  const total = noShows.length
  const rate = rows.length ? total / rows.length : 0

  const recent = noShows
    .sort((a, b) => (b['start_time'] || '').localeCompare(a['start_time'] || ''))
    .slice(0, 10)
    .map((row) => ({
      id: row['id'] ?? randomUUID(),
      salonName: row['salon_name'],
      customerName: row['customer_name'],
      staffName: row['staff_name'],
      startTime: row['start_time'],
      totalPrice: row['total_price'],
    }))

  return { count: total, rate, recent }
}

interface SalonStatEntry {
  salonId: string
  salonName: string | null
  data?: {
    avg_service_duration: number
    cancelled_appointments: number
    completed_appointments: number
    no_show_appointments: number
    total_appointments: number
    total_revenue: number
  } | null
}

export const mergeSalonPerformance = (entries: SalonStatEntry[]): SalonPerformance[] =>
  entries.map((entry) => ({
    salonId: entry.salonId,
    salonName: entry.salonName,
    total: entry.data?.total_appointments ?? 0,
    completed: entry.data?.completed_appointments ?? 0,
    cancelled: entry.data?.cancelled_appointments ?? 0,
    noShow: entry.data?.no_show_appointments ?? 0,
    totalRevenue: entry.data?.total_revenue ?? 0,
    avgDuration: entry.data?.avg_service_duration ?? 0,
  }))
