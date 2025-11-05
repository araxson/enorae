import 'server-only'

import type { RevenueMetrics } from '@/features/admin/finance/api/types'
import { requireAdminClient } from './client'
import { createOperationLogger } from '@/lib/observability'

export async function getPlatformRevenueAnalytics(
  startDate?: string,
  endDate?: string,
): Promise<RevenueMetrics> {
  const logger = createOperationLogger('getPlatformRevenueAnalytics', {})
  logger.start()

  const supabase = await requireAdminClient()

  let query = supabase
    .from('admin_revenue_overview_view')
    .select('date, total_revenue, service_revenue, product_revenue, total_appointments, completed_appointments, cancelled_appointments, no_show_appointments')
    .order('date', { ascending: false })

  if (startDate) {
    query = query.gte('date', startDate)
  }

  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query
  if (error) throw error

  const revenueData = data || []

  const totalRevenue = revenueData.reduce((sum, row) => sum + (Number(row.total_revenue) || 0), 0)
  const serviceRevenue = revenueData.reduce(
    (sum, row) => sum + (Number(row.service_revenue) || 0),
    0,
  )
  const productRevenue = revenueData.reduce(
    (sum, row) => sum + (Number(row.product_revenue) || 0),
    0,
  )
  const totalAppointments = revenueData.reduce(
    (sum, row) => sum + (row.total_appointments || 0),
    0,
  )
  const completedAppointments = revenueData.reduce(
    (sum, row) => sum + (row.completed_appointments || 0),
    0,
  )
  const cancelledAppointments = revenueData.reduce(
    (sum, row) => sum + (row.cancelled_appointments || 0),
    0,
  )
  const noShowAppointments = revenueData.reduce(
    (sum, row) => sum + (row.no_show_appointments || 0),
    0,
  )

  const avgRevenuePerAppointment =
    completedAppointments > 0 ? totalRevenue / completedAppointments : 0

  return {
    totalRevenue,
    serviceRevenue,
    productRevenue,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    avgRevenuePerAppointment,
    period: {
      start: startDate || revenueData[revenueData.length - 1]?.date || null,
      end: endDate || revenueData[0]?.date || null,
    },
  }
}
