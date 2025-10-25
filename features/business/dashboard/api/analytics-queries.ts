import 'server-only'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type DailyMetric = Database['public']['Views']['daily_metrics']['Row']
type Appointment = Database['public']['Views']['appointments']['Row']
type AppointmentService = Database['public']['Views']['appointment_services']['Row']

/**
 * Get revenue trend data for charts (last 30 days)
 */
export async function getRevenueTrendData(salonId: string, days: number = 30) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const supabase = await createClient()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('metric_at, total_revenue, service_revenue, product_revenue')
    .eq('salon_id', salonId)
    .gte('metric_at', cutoffDate.toISOString().split('T')[0])
    .order('metric_at', { ascending: true })

  if (error) {
    console.error('[getRevenueTrendData] Error:', error)
    return []
  }

  const metrics = (data || []) as DailyMetric[]
  return metrics
    .filter(m => m['metric_at'] !== null)
    .map(m => ({
      date: m['metric_at'] as string,
      revenue: Number(m['total_revenue']) || 0,
      serviceRevenue: Number(m['service_revenue']) || 0,
      productRevenue: Number(m['product_revenue']) || 0,
    }))
}

/**
 * Get appointment conversion funnel data
 */
export async function getAppointmentConversionData(salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments')
    .select('status')
    .eq('salon_id', salonId)

  if (error) {
    console.error('[getAppointmentConversionData] Error:', error)
    return {
      total: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
    }
  }

  const appointments = (data || []) as Appointment[]

  return {
    total: appointments.length,
    confirmed: appointments.filter(a => a['status'] === 'confirmed').length,
    completed: appointments.filter(a => a['status'] === 'completed').length,
    cancelled: appointments.filter(a => a['status'] === 'cancelled').length,
    noShow: appointments.filter(a => a['status'] === 'no_show').length,
  }
}

/**
 * Get top performing staff members
 */
export async function getStaffPerformanceData(salonId: string, limit: number = 5) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const supabase = await createClient()

  // Get completed appointments with staff data
  const { data, error } = await supabase
    .from('appointments')
    .select('staff_id, staff_name, total_price')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .not('staff_id', 'is', null)

  if (error) {
    console.error('[getStaffPerformanceData] Error:', error)
    return []
  }

  const appointments = (data || []) as Appointment[]

  // Aggregate by staff
  const staffMap = new Map<string, {
    id: string
    name: string
    appointmentCount: number
    totalRevenue: number
  }>()

  appointments.forEach(apt => {
    if (!apt['staff_id']) return

    const existing = staffMap.get(apt['staff_id'])
    if (existing) {
      existing.appointmentCount++
      existing['totalRevenue'] += Number(apt['total_price']) || 0
    } else {
      staffMap.set(apt['staff_id'], {
        id: apt['staff_id'],
        name: apt['staff_name'] || 'Unknown',
        appointmentCount: 1,
        totalRevenue: Number(apt['total_price']) || 0,
      })
    }
  })

  // Convert to array and sort by revenue
  return Array.from(staffMap.values())
    .sort((a, b) => b['totalRevenue'] - a['totalRevenue'])
    .slice(0, limit)
}

/**
 * Get popular services
 */
export async function getServicePopularityData(salonId: string, limit: number = 8) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointment_services')
    .select('service_id, service_name, current_price, status')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .not('service_id', 'is', null)

  if (error) {
    console.error('[getServicePopularityData] Error:', error)
    return []
  }

  const appointmentServices = (data || []) as AppointmentService[]

  // Aggregate by service
  const serviceMap = new Map<string, {
    name: string
    count: number
    revenue: number
  }>()

  appointmentServices.forEach(aps => {
    if (!aps['service_id'] || !aps['service_name']) return

    const existing = serviceMap.get(aps['service_id'])
    if (existing) {
      existing.count++
      existing.revenue += Number(aps['current_price']) || 0
    } else {
      serviceMap.set(aps['service_id'], {
        name: aps['service_name'],
        count: 1,
        revenue: Number(aps['current_price']) || 0,
      })
    }
  })

  // Convert to array and sort by count
  return Array.from(serviceMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
