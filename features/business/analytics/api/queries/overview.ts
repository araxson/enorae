import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { getUserSalonIds } from '@/lib/auth/permissions'

import type { DailyMetric } from '@/features/business/analytics/api/analytics.types'

export type AnalyticsOverview = {
  revenue: {
    total: number
    service: number
    product: number
    growth: number
  }
  appointments: {
    total: number
    completed: number
    cancelled: number
    noShow: number
    completionRate: number
  }
  customers: {
    total: number
    new: number
    returning: number
    retentionRate: number
  }
  staff: {
    active: number
    utilization: number
  }
}

export async function getAnalyticsOverview(
  salonId: string | null,
  startDate: string,
  endDate: string
): Promise<AnalyticsOverview> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  let targetSalonIds: string[]
  if (salonId) {
    if (!(await canAccessSalon(salonId))) {
      throw new Error('Unauthorized: Not your salon')
    }
    targetSalonIds = [salonId]
  } else {
    targetSalonIds = await getUserSalonIds()
  }

  if (!targetSalonIds.length) {
    throw new Error('No accessible salons found')
  }

  const response = await supabase
    .from('daily_metrics')
    .select('*')
    .in('salon_id', targetSalonIds)
    .gte('metric_at', startDate)
    .lte('metric_at', endDate)
    .order('metric_at', { ascending: true })

  if (response.error) throw response.error

  const dailyMetrics: DailyMetric[] = response.data || []

  const totalRevenue = dailyMetrics.reduce((sum, m) => sum + (m['total_revenue'] || 0), 0)
  const serviceRevenue = dailyMetrics.reduce((sum, m) => sum + (m['service_revenue'] || 0), 0)
  const productRevenue = dailyMetrics.reduce((sum, m) => sum + (m['product_revenue'] || 0), 0)

  const totalAppointments = dailyMetrics.reduce((sum, m) => sum + (m['total_appointments'] || 0), 0)
  const completedAppointments = dailyMetrics.reduce((sum, m) => sum + (m['completed_appointments'] || 0), 0)
  const cancelledAppointments = dailyMetrics.reduce((sum, m) => sum + (m['cancelled_appointments'] || 0), 0)
  const noShowAppointments = dailyMetrics.reduce((sum, m) => sum + (m['no_show_appointments'] || 0), 0)

  const newCustomers = dailyMetrics.reduce((sum, m) => sum + (m['new_customers'] || 0), 0)
  const returningCustomers = dailyMetrics.reduce((sum, m) => sum + (m['returning_customers'] || 0), 0)

  const avgStaffCount = dailyMetrics.length > 0
    ? dailyMetrics.reduce((sum, m) => sum + (m['active_staff_count'] || 0), 0) / dailyMetrics.length
    : 0

  const periodLength = Math.max(
    1,
    Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
  )
  const previousRangeStart = new Date(new Date(startDate).getTime() - periodLength * 24 * 60 * 60 * 1000)
  const prevStartDate = previousRangeStart.toISOString().split('T')[0]
  const prevEndDate = new Date(previousRangeStart.getTime() + (periodLength - 1) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const prevResponse = await supabase
    .from('daily_metrics')
    .select('total_revenue')
    .in('salon_id', targetSalonIds)
    .gte('metric_at', prevStartDate)
    .lte('metric_at', prevEndDate)

  if (prevResponse.error) throw prevResponse.error

  const prevMetrics: Array<{ total_revenue: number | null }> = prevResponse.data || []
  const prevRevenue = prevMetrics.reduce((sum, m) => sum + (m['total_revenue'] || 0), 0)
  const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

  return {
    revenue: {
      total: totalRevenue,
      service: serviceRevenue,
      product: productRevenue,
      growth: revenueGrowth,
    },
    appointments: {
      total: totalAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      noShow: noShowAppointments,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
    },
    customers: {
      total: newCustomers + returningCustomers,
      new: newCustomers,
      returning: returningCustomers,
      retentionRate: (newCustomers + returningCustomers) > 0
        ? (returningCustomers / (newCustomers + returningCustomers)) * 100
        : 0,
    },
    staff: {
      active: Math.round(avgStaffCount),
      utilization: 0,
    },
  }
}
