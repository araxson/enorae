import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import {
  buildStatusTotals,
  calculatePerformanceMetrics,
  buildCancellationPatterns,
  buildTrend,
} from './metrics'
import {
  buildNoShowRecords,
  buildFraudAlerts,
  buildDisputeCandidates,
} from './alerts'
import { mergeSalonPerformance } from './salons'
import type { AppointmentSnapshot } from './types'

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
      .from('appointments')
      .select('*')
      .gte('start_time', startIso)
      .order('start_time', { ascending: false })
      .limit(settings.appointmentLimit),
    supabase
      .from('admin_appointments_overview')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(settings.recentLimit),
    supabase
      .schema('analytics')
      .from('admin_analytics_overview')
      .select('*')
      .gte('date', startIso)
      .order('date', { ascending: false })
      .limit(settings.windowInDays),
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
    const id = row.salon_id
    if (!id) return
    const record = salonCounts.get(id) ?? { count: 0, salonName: row.salon_name ?? null }
    record.count += 1
    if (!record.salonName && row.salon_name) record.salonName = row.salon_name
    salonCounts.set(id, record)
  })

  const topSalonIds = Array.from(salonCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  const salonStats = await Promise.all(
    topSalonIds.map(async ([salonId, info]) => {
      const { data, error } = await supabase.rpc('get_appointment_stats', {
        p_salon_id: salonId,
        p_start_date: startIso,
        p_end_date: endIso,
      })

      if (error) {
        console.error('[AppointmentOversight] get_appointment_stats error', error)
      }

      return {
        salonId,
        salonName: info.salonName,
        data: data?.[0] ?? null,
      }
    }),
  )

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
