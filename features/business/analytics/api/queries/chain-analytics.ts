import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { getUserSalonIds } from '@/lib/auth/permissions'

export async function getChainSalonBreakdown(
  startDate: string,
  endDate: string
): Promise<Array<{ salonId: string; salonName: string; revenue: number; appointments: number }>> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const salonIds = await getUserSalonIds()
  if (!salonIds.length) return []

  const supabase = await createClient()

  const [{ data: metrics, error: metricsError }, { data: salons, error: salonsError }] = await Promise.all([
    supabase
      .from('daily_metrics_view')
      .select('salon_id, total_revenue, total_appointments')
      .in('salon_id', salonIds)
      .gte('metric_at', startDate)
      .lte('metric_at', endDate),
    supabase
      .from('salons_view')
      .select('id, name')
      .in('id', salonIds),
  ])

  if (metricsError) throw metricsError
  if (salonsError) throw salonsError

  const nameById = new Map<string, string>()
  for (const salon of salons || []) {
    const row = salon as { id: string | null; name: string | null }
    if (row.id) nameById.set(row.id, row.name || 'Unnamed Salon')
  }

  const aggregated = new Map<string, { revenue: number; appointments: number }>()
  for (const metric of (metrics || []) as Array<{ salon_id: string | null; total_revenue: number | null; total_appointments: number | null }>) {
    if (!metric.salon_id) continue
    const current = aggregated.get(metric.salon_id) || { revenue: 0, appointments: 0 }
    current.revenue += metric.total_revenue || 0
    current.appointments += metric.total_appointments || 0
    aggregated.set(metric.salon_id, current)
  }

  return Array.from(aggregated.entries())
    .map(([salonId, value]) => ({
      salonId,
      salonName: nameById.get(salonId) || 'Unnamed Salon',
      revenue: value.revenue,
      appointments: value.appointments,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

export async function getChainRevenueComparison(
  startDate: string,
  endDate: string
): Promise<{
  totalRevenue: number
  previousRevenue: number
  momGrowth: number
  yoyRevenue: number
  yoyGrowth: number
}> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const salonIds = await getUserSalonIds()
  if (!salonIds.length) {
    return { totalRevenue: 0, previousRevenue: 0, momGrowth: 0, yoyRevenue: 0, yoyGrowth: 0 }
  }

  const supabase = await createClient()

  const periodDays = Math.max(
    1,
    Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
  )

  const prevStart = new Date(new Date(startDate).getTime() - periodDays * 24 * 60 * 60 * 1000)
  const prevEnd = new Date(prevStart.getTime() + (periodDays - 1) * 24 * 60 * 60 * 1000)
  const prevStartDate = prevStart.toISOString().split('T')[0]
  const prevEndDate = prevEnd.toISOString().split('T')[0]

  const yearMs = 365 * 24 * 60 * 60 * 1000
  const yoyStart = new Date(new Date(startDate).getTime() - yearMs)
  const yoyEnd = new Date(new Date(endDate).getTime() - yearMs)
  const yoyStartDate = yoyStart.toISOString().split('T')[0]
  const yoyEndDate = yoyEnd.toISOString().split('T')[0]

  const [current, previous, yoy] = await Promise.all([
    supabase
      .from('daily_metrics_view')
      .select('total_revenue')
      .in('salon_id', salonIds)
      .gte('metric_at', startDate)
      .lte('metric_at', endDate),
    supabase
      .from('daily_metrics_view')
      .select('total_revenue')
      .in('salon_id', salonIds)
      .gte('metric_at', prevStartDate)
      .lte('metric_at', prevEndDate),
    supabase
      .from('daily_metrics_view')
      .select('total_revenue')
      .in('salon_id', salonIds)
      .gte('metric_at', yoyStartDate)
      .lte('metric_at', yoyEndDate),
  ])

  if (current.error) throw current.error
  if (previous.error) throw previous.error
  if (yoy.error) throw yoy.error

  const sum = (rows: Array<{ total_revenue: number | null }> | null | undefined) =>
    (rows || []).reduce((acc, row) => acc + (row.total_revenue || 0), 0)

  const totalRevenue = sum(current.data as Array<{ total_revenue: number | null }> | null | undefined)
  const previousRevenue = sum(previous.data as Array<{ total_revenue: number | null }> | null | undefined)
  const yoyRevenue = sum(yoy.data as Array<{ total_revenue: number | null }> | null | undefined)

  const momGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
  const yoyGrowth = yoyRevenue > 0 ? ((totalRevenue - yoyRevenue) / yoyRevenue) * 100 : 0

  return { totalRevenue, previousRevenue, momGrowth, yoyRevenue, yoyGrowth }
}
