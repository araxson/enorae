import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { AppointmentSnapshot, AppointmentRow, AppointmentOverviewRow } from '@/features/admin/appointments/types'
import { createOperationLogger } from '@/lib/observability/logger'
import {
  buildStatusTotals,
  calculatePerformanceMetrics,
  buildCancellationPatterns,
  buildTrend,
  buildNoShowRecords,
  buildFraudAlerts,
  buildDisputeCandidates,
  mergeSalonPerformance,
} from './helpers'

type AdminAnalyticsOverviewRow = {
  date: string | null
  platform_appointments: number | null
  platform_cancelled_appointments: number | null
  platform_no_shows: number | null
  platform_completed_appointments: number | null
}

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
  const logger = createOperationLogger('getAppointmentSnapshot', {})
  logger.start()

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
