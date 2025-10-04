import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type AppointmentService = Database['public']['Views']['appointment_services']['Row']
type Appointment = Database['public']['Views']['appointments']['Row']
type DailyMetric = Database['public']['Views']['daily_metrics']['Row']

// Service and staff stats types
type ServiceStats = {
  name: string
  count: number
  revenue: number
}

type StaffStats = {
  name: string
  title: string | null
  count: number
  revenue: number
}

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

/**
 * Get comprehensive analytics overview for a date range
 */
export async function getAnalyticsOverview(
  salonId: string,
  startDate: string,
  endDate: string
): Promise<AnalyticsOverview> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Get daily metrics for the period
  const response = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', startDate)
    .lte('metric_at', endDate)
    .order('metric_at', { ascending: true })

  if (response.error) throw response.error

  const dailyMetrics: DailyMetric[] = response.data || []

  // Calculate totals
  const totalRevenue = dailyMetrics.reduce((sum, m) => sum + (m.total_revenue || 0), 0)
  const serviceRevenue = dailyMetrics.reduce((sum, m) => sum + (m.service_revenue || 0), 0)
  const productRevenue = dailyMetrics.reduce((sum, m) => sum + (m.product_revenue || 0), 0)

  const totalAppointments = dailyMetrics.reduce((sum, m) => sum + (m.total_appointments || 0), 0)
  const completedAppointments = dailyMetrics.reduce((sum, m) => sum + (m.completed_appointments || 0), 0)
  const cancelledAppointments = dailyMetrics.reduce((sum, m) => sum + (m.cancelled_appointments || 0), 0)
  const noShowAppointments = dailyMetrics.reduce((sum, m) => sum + (m.no_show_appointments || 0), 0)

  const newCustomers = dailyMetrics.reduce((sum, m) => sum + (m.new_customers || 0), 0)
  const returningCustomers = dailyMetrics.reduce((sum, m) => sum + (m.returning_customers || 0), 0)

  const avgStaffCount = dailyMetrics.length > 0
    ? dailyMetrics.reduce((sum, m) => sum + (m.active_staff_count || 0), 0) / dailyMetrics.length
    : 0

  // Calculate previous period for growth comparison
  const periodLength = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
  const prevStartDate = new Date(new Date(startDate).getTime() - periodLength * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const prevEndDate = new Date(new Date(startDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const prevResponse = await supabase
    .from('daily_metrics')
    .select('total_revenue')
    .eq('salon_id', salonId)
    .gte('metric_at', prevStartDate)
    .lte('metric_at', prevEndDate)

  const prevMetrics: DailyMetric[] = prevResponse.data || []
  const prevRevenue = prevMetrics.reduce((sum, m) => sum + (m.total_revenue || 0), 0)
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
      utilization: 0, // Would need additional calculation
    },
  }
}

/**
 * Get daily metrics time series data
 */
export async function getDailyMetricsTimeSeries(
  salonId: string,
  startDate: string,
  endDate: string
) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const response = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', startDate)
    .lte('metric_at', endDate)
    .order('metric_at', { ascending: true })

  if (response.error) throw response.error

  const data: DailyMetric[] = response.data || []
  return data.map(m => ({
    date: m.metric_at,
    revenue: m.total_revenue || 0,
    serviceRevenue: m.service_revenue || 0,
    productRevenue: m.product_revenue || 0,
    appointments: m.total_appointments || 0,
    completed: m.completed_appointments || 0,
    cancelled: m.cancelled_appointments || 0,
    newCustomers: m.new_customers || 0,
    returningCustomers: m.returning_customers || 0,
  }))
}

/**
 * Get top performing services
 * IMPROVED: Uses appointment_services view (eliminates nested SELECT)
 */
export async function getTopServices(salonId: string, startDate: string, endDate: string, limit: number = 10) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // ✅ FIXED: Query appointment_services view directly with service data pre-joined
  const { data, error } = await supabase
    .from('appointment_services')
    .select('service_id, service_name, current_price, status, appointment_id')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .gte('start_time', startDate)
    .lte('start_time', endDate)

  if (error) throw error
  if (!data) return []

  const appointmentServices = data as AppointmentService[]

  // Aggregate service performance
  const serviceStats = new Map<string, ServiceStats>()

  appointmentServices.forEach((aps) => {
    if (!aps.service_id || !aps.service_name) return

    if (!serviceStats.has(aps.service_id)) {
      serviceStats.set(aps.service_id, {
        name: aps.service_name,
        count: 0,
        revenue: 0,
      })
    }

    const stats = serviceStats.get(aps.service_id)!
    stats.count++
    stats.revenue += aps.current_price || 0
  })

  // Convert to array and sort by revenue
  return Array.from(serviceStats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

/**
 * Get top performing staff
 * IMPROVED: Uses appointments view (eliminates nested SELECT)
 */
export async function getTopStaff(salonId: string, startDate: string, endDate: string, limit: number = 10) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // ✅ FIXED: Query appointments view with staff data pre-joined
  const { data, error } = await supabase
    .from('appointments')
    .select('staff_id, staff_name, staff_title, total_price')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .gte('start_time', startDate)
    .lte('start_time', endDate)

  if (error) throw error
  if (!data) return []

  const appointments = data as Appointment[]

  // Aggregate staff performance
  const staffStats = new Map<string, StaffStats>()

  appointments.forEach((apt) => {
    if (!apt.staff_id) return

    if (!staffStats.has(apt.staff_id)) {
      staffStats.set(apt.staff_id, {
        name: apt.staff_name || 'Unknown',
        title: apt.staff_title,
        count: 0,
        revenue: 0,
      })
    }

    const stats = staffStats.get(apt.staff_id)!
    stats.count++
    stats.revenue += apt.total_price || 0
  })

  return Array.from(staffStats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

/**
 * Get customer acquisition trends
 */
export async function getCustomerTrends(salonId: string, startDate: string, endDate: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const response = await supabase
    .from('daily_metrics')
    .select('metric_at, new_customers, returning_customers')
    .eq('salon_id', salonId)
    .gte('metric_at', startDate)
    .lte('metric_at', endDate)
    .order('metric_at', { ascending: true })

  if (response.error) throw response.error

  const data: DailyMetric[] = response.data || []
  return data.map(m => ({
    date: m.metric_at,
    newCustomers: m.new_customers || 0,
    returningCustomers: m.returning_customers || 0,
  }))
}

/**
 * Get salon for current user (for analytics)
 */
export async function getAnalyticsSalon() {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: salon, error } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()

  if (error || !salon) {
    throw new Error('No salon found for your account')
  }

  return salon as { id: string }
}
