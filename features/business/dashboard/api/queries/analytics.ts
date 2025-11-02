import 'server-only'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type DailyMetric = Database['public']['Views']['daily_metrics_view']['Row']
type AppointmentRow = Database['public']['Views']['appointments_view']['Row']
type ManualTransaction = Database['public']['Views']['manual_transactions_view']['Row']
type AppointmentService = Database['scheduling']['Tables']['appointment_services']['Row']
type StaffProfile = Database['public']['Views']['staff_enriched_view']['Row']
type ServiceRow = Database['public']['Views']['services_view']['Row']

/**
 * Get revenue trend data for charts (last 30 days)
 */
export async function getRevenueTrendData(salonId: string, days: number = 30) {
  const logger = createOperationLogger('getRevenueTrendData', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const supabase = await createClient()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const { data, error } = await supabase
    .from('daily_metrics_view')
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
    .from('appointments_view')
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

  const appointments = (data || []) as AppointmentRow[]

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

  const [appointmentsResponse, paymentsResponse, staffProfilesResponse] = await Promise.all([
    supabase
      .from('appointments_view')
      .select('staff_id')
      .eq('salon_id', salonId)
      .eq('status', 'completed')
      .not('staff_id', 'is', null),
    supabase
      .from('manual_transactions_view')
      .select('staff_id, amount, transaction_type')
      .eq('salon_id', salonId)
      .in('transaction_type', ['service_payment', 'product_sale', 'tip', 'fee', 'other'])
      .not('staff_id', 'is', null),
    supabase
      .from('staff_enriched_view')
      .select('id, name')
      .eq('salon_id', salonId),
  ])

  if (appointmentsResponse.error) {
    console.error('[getStaffPerformanceData] Appointments error:', appointmentsResponse.error)
    return []
  }
  if (paymentsResponse.error) {
    console.error('[getStaffPerformanceData] Payments error:', paymentsResponse.error)
    return []
  }
  if (staffProfilesResponse.error) {
    console.error('[getStaffPerformanceData] Staff profile error:', staffProfilesResponse.error)
    return []
  }

  const appointmentCounts = new Map<string, number>()
  ;((appointmentsResponse.data ?? []) as AppointmentRow[]).forEach(appointment => {
    if (!appointment['staff_id']) return
    appointmentCounts.set(
      appointment['staff_id'],
      (appointmentCounts.get(appointment['staff_id']) ?? 0) + 1
    )
  })

  const revenueByStaff = new Map<string, number>()
  ;((paymentsResponse.data ?? []) as ManualTransaction[]).forEach(payment => {
    if (!payment['staff_id']) return
    const amount = Number(payment['amount'] ?? 0)
    if (!amount) return
    revenueByStaff.set(
      payment['staff_id'],
      (revenueByStaff.get(payment['staff_id']) ?? 0) + amount
    )
  })

  const staffNameMap = new Map<string, string>()
  ;((staffProfilesResponse.data ?? []) as StaffProfile[]).forEach(profile => {
    if (!profile['id']) return
    staffNameMap.set(profile['id'], profile['name'] || 'Unknown')
  })

  const performance = Array.from(appointmentCounts.entries()).map(([staffId, count]) => ({
    id: staffId,
    name: staffNameMap.get(staffId) || 'Unknown',
    appointmentCount: count,
    totalRevenue: revenueByStaff.get(staffId) ?? 0,
  }))

  return performance
    .sort((a, b) => b.totalRevenue - a.totalRevenue || b.appointmentCount - a.appointmentCount)
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

  const { data: appointmentRows, error: appointmentsError } = await supabase
    .from('appointments_view')
    .select('id')
    .eq('salon_id', salonId)
    .eq('status', 'completed')

  if (appointmentsError) {
    console.error('[getServicePopularityData] Appointments error:', appointmentsError)
    return []
  }

  const appointmentIds = ((appointmentRows ?? []) as AppointmentRow[])
    .map(row => row.id)
    .filter((id): id is string => Boolean(id))

  if (appointmentIds.length === 0) {
    return []
  }

  const chunkSize = 500
  const appointmentServices: AppointmentService[] = []

  for (let i = 0; i < appointmentIds.length; i += chunkSize) {
    const slice = appointmentIds.slice(i, i + chunkSize)
    const { data, error } = await supabase
      .schema('scheduling')
      .from('appointment_services')
      .select('appointment_id, service_id')
      .in('appointment_id', slice)

    if (error) {
      console.error('[getServicePopularityData] Services fetch error:', error)
      return []
    }

    appointmentServices.push(...(((data ?? []) as AppointmentService[])))
  }

  // Aggregate by service
  const serviceMap = new Map<string, {
    name: string
    count: number
    revenue: number
  }>()

  const serviceIds = new Set<string>()
  appointmentServices.forEach(aps => {
    if (!aps['service_id']) return
    serviceIds.add(aps['service_id'])
    const existing = serviceMap.get(aps['service_id'])
    if (existing) {
      existing.count++
    } else {
      serviceMap.set(aps['service_id'], {
        name: 'Unknown',
        count: 1,
        revenue: 0,
      })
    }
  })

  if (serviceIds.size === 0) {
    return []
  }

  const serviceIdList = Array.from(serviceIds)
  const serviceInfo: ServiceRow[] = []
  for (let i = 0; i < serviceIdList.length; i += chunkSize) {
    const slice = serviceIdList.slice(i, i + chunkSize)
    const { data, error } = await supabase
      .from('services_view')
      .select('id, name, current_price')
      .in('id', slice)
      .eq('salon_id', salonId)

    if (error) {
      console.error('[getServicePopularityData] Service details error:', error)
      return []
    }

    serviceInfo.push(...(((data ?? []) as ServiceRow[])))
  }

  serviceInfo.forEach(service => {
    if (!service['id']) return
    const entry = serviceMap.get(service['id'])
    if (!entry) return
    entry.name = service['name'] || entry.name
    entry.revenue = (service['current_price'] || 0) * entry.count
  })

  // Convert to array and sort by count
  return Array.from(serviceMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
