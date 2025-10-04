import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// FIXED: Use admin_revenue_overview view
type AdminRevenue = Database['public']['Views']['admin_revenue_overview']['Row']
type Appointment = Database['public']['Views']['appointments']['Row']
type AppointmentService = Database['public']['Views']['appointment_services']['Row']

export type RevenueSummary = {
  totalRevenue: number
  totalAppointments: number
  averageOrderValue: number
  revenueGrowth: number
}

export type SalonRevenue = {
  salonId: string
  salonName: string
  totalRevenue: number
  appointmentCount: number
  averageOrderValue: number
}

export type ServiceRevenue = {
  serviceId: string
  serviceName: string
  serviceCategory: string | null
  totalRevenue: number
  bookingCount: number
  averagePrice: number
}

export type RevenueTimeseries = {
  date: string
  revenue: number
  appointmentCount: number
}

/**
 * Get platform-wide revenue summary
 */
export async function getRevenueSummary(
  dateFrom: string,
  dateTo: string
): Promise<RevenueSummary> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // Get completed appointments with pricing
  const { data: appointments } = await supabase
    .from('appointments')
    .select('total_price, created_at')
    .eq('status', 'completed')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)

  type AppointmentRevenue = { total_price: number | null }
  const totalRevenue = ((appointments || []) as AppointmentRevenue[]).reduce(
    (sum, apt) => sum + (apt.total_price || 0),
    0
  )
  const totalAppointments = appointments?.length || 0
  const averageOrderValue = totalAppointments > 0 ? totalRevenue / totalAppointments : 0

  // Get previous period for growth calculation
  const periodLength = new Date(dateTo).getTime() - new Date(dateFrom).getTime()
  const prevDateFrom = new Date(new Date(dateFrom).getTime() - periodLength).toISOString()
  const prevDateTo = dateFrom

  const { data: prevAppointments } = await supabase
    .from('appointments')
    .select('total_price')
    .eq('status', 'completed')
    .gte('start_time', prevDateFrom)
    .lte('start_time', prevDateTo)

  const prevRevenue = ((prevAppointments || []) as AppointmentRevenue[]).reduce(
    (sum, apt) => sum + (apt.total_price || 0),
    0
  )

  const revenueGrowth =
    prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

  return {
    totalRevenue,
    totalAppointments,
    averageOrderValue,
    revenueGrowth,
  }
}

/**
 * Get revenue by salon
 * IMPROVED: Uses admin_revenue_overview (eliminates N+1 pattern)
 */
export async function getSalonRevenue(
  dateFrom: string,
  dateTo: string,
  limit = 20
): Promise<SalonRevenue[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // ✅ FIXED: Single query to view with pre-computed revenue metrics
  const { data, error } = await supabase
    .from('admin_revenue_overview')
    .select('salon_id, salon_name, total_revenue, completed_appointments')
    .gte('date', dateFrom)
    .lte('date', dateTo)

  if (error) throw error
  if (!data) return []

  const revenue = data as AdminRevenue[]

  // Group by salon and aggregate
  const salonMap = new Map<string, {
    name: string
    totalRevenue: number
    appointmentCount: number
  }>()

  revenue.forEach(row => {
    if (!row.salon_id) return

    if (!salonMap.has(row.salon_id)) {
      salonMap.set(row.salon_id, {
        name: row.salon_name || 'Unknown',
        totalRevenue: 0,
        appointmentCount: 0,
      })
    }

    const entry = salonMap.get(row.salon_id)!
    entry.totalRevenue += row.total_revenue || 0
    entry.appointmentCount += row.completed_appointments || 0
  })

  // Convert to array
  const salonRevenues: SalonRevenue[] = Array.from(salonMap.entries()).map(
    ([salonId, data]) => ({
      salonId,
      salonName: data.name,
      totalRevenue: data.totalRevenue,
      appointmentCount: data.appointmentCount,
      averageOrderValue:
        data.appointmentCount > 0 ? data.totalRevenue / data.appointmentCount : 0,
    })
  )

  return salonRevenues.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, limit)
}

/**
 * Get revenue by service
 * IMPROVED: Uses appointment_services view (eliminates N+1 pattern)
 */
export async function getServiceRevenue(
  dateFrom: string,
  dateTo: string,
  limit = 20
): Promise<ServiceRevenue[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // ✅ FIXED: Single query to appointment_services with service pricing
  const { data, error } = await supabase
    .from('appointment_services')
    .select('service_id, service_name, category_name, current_price, status, start_time')
    .eq('status', 'completed')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)

  if (error) throw error
  if (!data) return []

  const appointmentServices = data as AppointmentService[]

  // Group by service and aggregate
  const serviceMap = new Map<string, {
    name: string
    category: string | null
    totalRevenue: number
    bookingCount: number
  }>()

  appointmentServices.forEach(aps => {
    if (!aps.service_id) return

    if (!serviceMap.has(aps.service_id)) {
      serviceMap.set(aps.service_id, {
        name: aps.service_name || 'Unknown',
        category: aps.category_name || null,
        totalRevenue: 0,
        bookingCount: 0,
      })
    }

    const entry = serviceMap.get(aps.service_id)!
    entry.totalRevenue += aps.current_price || 0
    entry.bookingCount += 1
  })

  // Convert to array
  const serviceRevenues: ServiceRevenue[] = Array.from(serviceMap.entries())
    .map(([serviceId, data]) => ({
      serviceId,
      serviceName: data.name,
      serviceCategory: data.category,
      totalRevenue: data.totalRevenue,
      bookingCount: data.bookingCount,
      averagePrice: data.bookingCount > 0 ? data.totalRevenue / data.bookingCount : 0,
    }))
    .filter(s => s.bookingCount > 0)

  return serviceRevenues.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, limit)
}

/**
 * Get revenue timeseries data
 */
export async function getRevenueTimeseries(
  dateFrom: string,
  dateTo: string
): Promise<RevenueTimeseries[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('total_price, start_time')
    .eq('status', 'completed')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)
    .order('start_time', { ascending: true })

  if (!appointments) return []

  const appointmentsList = appointments as Appointment[]

  // Group by date
  const dateMap = new Map<string, { revenue: number; count: number }>()

  for (const apt of appointmentsList) {
    if (!apt.start_time) continue
    const date = new Date(apt.start_time).toISOString().split('T')[0]

    if (!dateMap.has(date)) {
      dateMap.set(date, { revenue: 0, count: 0 })
    }

    const entry = dateMap.get(date)!
    entry.revenue += apt.total_price || 0
    entry.count++
  }

  const timeseries: RevenueTimeseries[] = []

  for (const [date, data] of dateMap.entries()) {
    timeseries.push({
      date,
      revenue: data.revenue,
      appointmentCount: data.count,
    })
  }

  return timeseries.sort((a, b) => a.date.localeCompare(b.date))
}
