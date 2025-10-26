import 'server-only'

import { differenceInHours, differenceInMinutes, parseISO } from 'date-fns'
import { randomUUID } from 'node:crypto'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { AppointmentSnapshot, AppointmentRow, AppointmentOverviewRow } from '@/features/admin/appointments/types'
import type {
  AppointmentStatusTotals,
  AppointmentTrendPoint,
  CancellationPattern,
  DisputeCandidate,
  FraudAlert,
  SalonPerformance,
} from '@/features/admin/appointments/types'

type AdminAnalyticsOverviewRow = {
  date: string | null
  platform_appointments: number | null
  platform_cancelled_appointments: number | null
  platform_no_shows: number | null
  platform_completed_appointments: number | null
}

// ============================================================================
// METRICS HELPERS (consolidated from metrics.ts)
// ============================================================================

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

const buildStatusTotals = (rows: AppointmentRow[]): AppointmentStatusTotals => {
  if (!rows.length) return { ...ZERO_TOTALS }

  return rows.reduce((acc, row) => {
    acc.total += 1
    const status = row['status'] ?? 'pending'

    if (status === 'completed') acc.completed += 1
    else if (status === 'cancelled') acc.cancelled += 1
    else if (status === 'no_show') acc.noShow += 1
    else if (status === 'in_progress' || status === 'checked_in') acc.inProgress += 1

    const startTime = row['start_time'] ? parseISO(row['start_time']) : null
    if (startTime && startTime > new Date() && !['cancelled', 'no_show'].includes(status)) {
      acc.upcoming += 1
    }

    return acc
  }, { ...ZERO_TOTALS })
}

const calculatePerformanceMetrics = (
  totals: AppointmentStatusTotals,
  rows: AppointmentRow[],
): AppointmentSnapshot['performance'] => {
  const completedRevenue = rows
    .filter((row) => row['status'] === 'completed' && typeof row['total_price'] === 'number')
    .reduce((acc, row) => acc + (row['total_price'] || 0), 0)

  const averageDuration = rows.length
    ? rows.reduce((acc, row) => acc + (row['duration_minutes'] || 0), 0) / rows.length
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

const buildCancellationPatterns = (
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

const buildTrend = <T extends {
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

// ============================================================================
// ALERTS HELPERS (consolidated from alerts.ts)
// ============================================================================

const HOURS_IN_DAY = 24

const buildNoShowRecords = (rows: AppointmentRow[]): AppointmentSnapshot['noShows'] => {
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

const buildFraudAlerts = (rows: AppointmentRow[]): FraudAlert[] => {
  const alerts: FraudAlert[] = []
  const customerCounts = new Map<string, { cancellations: number; noShows: number; appointments: string[] }>()
  const staffAppointments = new Map<string, AppointmentRow[]>()

  rows.forEach((row) => {
    const customerKey = row['customer_id'] ?? row['customer_email'] ?? 'anonymous'
    const status = row.status ?? 'pending'

    const customer = customerCounts.get(customerKey) ?? { cancellations: 0, noShows: 0, appointments: [] }
    if (status === 'cancelled') customer.cancellations += 1
    if (status === 'no_show') customer.noShows += 1
    customer.appointments.push(row['id'] ?? randomUUID())
    customerCounts.set(customerKey, customer)

    if (row['staff_id']) {
      const list = staffAppointments.get(row['staff_id']) ?? []
      list.push(row)
      staffAppointments.set(row['staff_id'], list)
    }

    const totalPrice = row['total_price']
    if (status === 'cancelled' && totalPrice && totalPrice > 250) {
      alerts.push({
        id: `high-value-${row['id']}`,
        type: 'high_value_cancellation',
        score: Math.min(1, totalPrice / 500),
        summary: `${row['customer_name'] || 'Customer'} cancelled a high-value booking ($${totalPrice.toFixed(0)})`,
        relatedAppointmentIds: [row['id'] ?? randomUUID()],
        customerId: row['customer_id'],
        salonId: row['salon_id'],
      })
    }

    const startTime = row['start_time']
    const updatedAt = row['updated_at']
    if (status === 'cancelled' && startTime && updatedAt) {
      const start = parseISO(startTime)
      const updated = parseISO(updatedAt)
      const hoursBefore = differenceInHours(start, updated)
      if (hoursBefore >= 0 && hoursBefore < 2) {
        alerts.push({
          id: `rapid-cancel-${row['id']}`,
          type: 'rapid_cancellation',
          score: Math.min(1, (2 - hoursBefore) / 2),
          summary: `${row['customer_name'] || 'Customer'} cancelled within ${hoursBefore.toFixed(1)}h of start`,
          relatedAppointmentIds: [row['id'] ?? randomUUID()],
          customerId: row['customer_id'],
          salonId: row['salon_id'],
        })
      }
    }
  })

  customerCounts.forEach((value, key) => {
    if (value.noShows >= 3 || value.cancellations >= 4) {
      alerts.push({
        id: `repeat-${key}`,
        type: 'repeated_no_show',
        score: Math.min(1, (value.noShows + value.cancellations) / 6),
        summary: `Customer ${key} has ${value.noShows} no-shows and ${value.cancellations} cancellations`,
        relatedAppointmentIds: value.appointments,
        customerId: key,
      })
    }
  })

  staffAppointments.forEach((list, staffId) => {
    const sorted = list
      .filter((row) => row['start_time'])
      .sort((a, b) => (a['start_time'] || '').localeCompare(b['start_time'] || ''))

    for (let i = 0; i < sorted.length - 1; i += 1) {
      const current = sorted[i]
      const next = sorted[i + 1]
      if (!current || !next) continue
      const currentStartTime = current['start_time']
      const nextStartTime = next['start_time']
      if (!currentStartTime || !nextStartTime) continue
      const diff = differenceInMinutes(parseISO(nextStartTime), parseISO(currentStartTime))
      if (diff >= 0 && diff < 45) {
        alerts.push({
          id: `double-booking-${staffId}-${current['id']}`,
          type: 'double_booking_risk',
          score: Math.min(1, (45 - diff) / 45),
          summary: `${current['staff_name'] || 'Staff'} has back-to-back appointments (${diff} mins apart)`,
          relatedAppointmentIds: [current['id'] ?? randomUUID(), next['id'] ?? randomUUID()],
          salonId: current['salon_id'],
        })
      }
    }
  })

  return alerts
}

const buildDisputeCandidates = (rows: AppointmentRow[]): DisputeCandidate[] => {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * HOURS_IN_DAY * 60 * 60 * 1000)

  return rows
    .filter((row) => {
      const startTime = row['start_time']
      return (row.status === 'cancelled' || row.status === 'no_show') &&
        startTime &&
        parseISO(startTime) >= sevenDaysAgo &&
        (row['total_price'] ?? 0) > 100
    })
    .map((row) => {
      const startTime = row['start_time'] as string
      const updatedAt = row['updated_at']
      const start = parseISO(startTime)
      const updated = updatedAt ? parseISO(updatedAt) : undefined
      const hoursBefore = updated ? differenceInHours(start, updated) : null

      const isSameDay = hoursBefore !== null && hoursBefore <= 24
      const reason = row.status === 'no_show'
        ? 'No-show on high-value booking'
        : isSameDay
          ? 'Same-day cancellation on premium booking'
          : 'High-value appointment cancellation'

      const recommendedAction = row.status === 'no_show'
        ? 'Contact customer, review penalty policy, and re-engage salon'
        : 'Review cancellation reason, consider partial refund, notify finance'

      return {
        appointmentId: row['id'] ?? randomUUID(),
        customerName: row['customer_name'],
        salonName: row['salon_name'],
        status: 'review',
        amount: row['total_price'],
        reason,
        recommendedAction,
      }
    })
}

// ============================================================================
// SALON HELPERS (consolidated from salons.ts)
// ============================================================================

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

const mergeSalonPerformance = (entries: SalonStatEntry[]): SalonPerformance[] =>
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

interface SnapshotOptions {
  windowInDays?: number
  appointmentLimit?: number
  recentLimit?: number
}

const DEFAULT_OPTIONS: Required<SnapshotOptions> = {
  windowInDays: 30,
  appointmentLimit: 300,
  recentLimit: 60,
}

export async function getAppointmentSnapshot(
  options: SnapshotOptions = {},
): Promise<AppointmentSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const settings = { ...DEFAULT_OPTIONS, ...options }
  const supabase = createServiceRoleClient()

  const now = new Date()
  const start = new Date(now.getTime() - settings.windowInDays * 24 * 60 * 60 * 1000)
  const startIso = start.toISOString()
  const endIso = now.toISOString()

  const [appointmentsRes, overviewRes, analyticsRes] = await Promise.all([
    supabase
      .from('admin_appointments_overview_view')
      .select('*')
      .gte('start_time', startIso)
      .order('start_time', { ascending: false })
      .limit(settings.appointmentLimit)
      .returns<AppointmentRow[]>(),
    supabase
      .from('admin_appointments_overview_view')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(settings.recentLimit)
      .returns<AppointmentOverviewRow[]>(),
    supabase
      .from('admin_analytics_overview_view')
      .select('*')
      .gte('date', startIso)
      .order('date', { ascending: false })
      .limit(settings.windowInDays)
      .returns<AdminAnalyticsOverviewRow[]>(),
  ])

  if (appointmentsRes.error) {
    console.error('[AppointmentOversight] appointments query failed', appointmentsRes.error)
  }
  if (overviewRes.error) {
    console.error('[AppointmentOversight] overview query failed', overviewRes.error)
  }
  if (analyticsRes.error) {
    console.error('[AppointmentOversight] analytics query failed', analyticsRes.error)
  }

  const appointmentRows = appointmentsRes.data ?? []
  const overviewRows = overviewRes.data ?? []
  const analyticsRows = analyticsRes.data ?? []

  const totals = buildStatusTotals(appointmentRows)
  const performance = calculatePerformanceMetrics(totals, appointmentRows)
  const cancellations = buildCancellationPatterns(appointmentRows)
  const trend = buildTrend(analyticsRows)
  const noShows = buildNoShowRecords(appointmentRows)
  const fraudAlerts = buildFraudAlerts(appointmentRows)
  const disputes = buildDisputeCandidates(appointmentRows)

  const salonCounts = new Map<string, { count: number; salonName: string | null }>()
  appointmentRows.forEach((row) => {
    const id = row['salon_id']
    if (!id) return
    const record = salonCounts.get(id) ?? { count: 0, salonName: row['salon_name'] ?? null }
    record.count += 1
    if (!record.salonName && row['salon_name']) record.salonName = row['salon_name']
    salonCounts.set(id, record)
  })

  const topSalonIds = Array.from(salonCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  const salonStats = topSalonIds.map(([salonId, info]) => {
    const salonAppointments = appointmentRows.filter((row) => row['salon_id'] === salonId)
    const totalAppointments = salonAppointments.length
    const completedAppointments = salonAppointments.filter((row) => row['status'] === 'completed').length
    const cancelledAppointments = salonAppointments.filter((row) => row['status'] === 'cancelled').length
    const noShowAppointments = salonAppointments.filter((row) => row['status'] === 'no_show').length
    const totalRevenue = salonAppointments
      .filter((row) => row['status'] === 'completed')
      .reduce((sum, row) => sum + (row['total_price'] || 0), 0)
    const avgDuration =
      totalAppointments > 0
        ? salonAppointments.reduce((sum, row) => sum + (row['duration_minutes'] || 0), 0) /
          totalAppointments
        : 0

    return {
      salonId,
      salonName: info.salonName,
      data: {
        avg_service_duration: avgDuration,
        cancelled_appointments: cancelledAppointments,
        completed_appointments: completedAppointments,
        no_show_appointments: noShowAppointments,
        total_appointments: totalAppointments,
        total_revenue: totalRevenue,
      },
    }
  })

  return {
    timeframe: { start: startIso, end: endIso },
    totals,
    performance,
    trend,
    cancellations,
    noShows,
    fraudAlerts,
    disputes,
    salonPerformance: mergeSalonPerformance(salonStats),
    recentAppointments: overviewRows,
  }
}
