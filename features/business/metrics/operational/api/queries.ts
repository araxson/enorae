import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type OperationalMetric = Database['public']['Views']['operational_metrics']['Row']
type Appointment = Database['public']['Views']['appointments']['Row']
type Salon = Database['public']['Views']['salons']['Row']
type Staff = Database['public']['Views']['staff']['Row']

export type OperationalMetrics = OperationalMetric

/**
 * Get operational metrics from database view
 * IMPROVED: Uses operational_metrics view for pre-computed analytics
 */
export async function getOperationalMetrics(
  salonId: string,
  dateFrom: string,
  dateTo: string
): Promise<OperationalMetric[]> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Verify salon ownership
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (!salon || (salon as Salon).owner_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('operational_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', dateFrom)
    .lte('metric_at', dateTo)
    .order('metric_at', { ascending: false })

  if (error) throw error
  return (data || []) as OperationalMetric[]
}

/**
 * Get latest operational metrics
 * Uses view for instant access to pre-computed data
 */
export async function getLatestOperationalMetric(
  salonId: string
): Promise<OperationalMetric | null> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Verify salon ownership
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (!salon || (salon as Salon).owner_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('operational_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .order('metric_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as OperationalMetric
}

export type ServiceDistribution = {
  serviceName: string
  serviceCount: number
  totalRevenue: number
  avgDuration: number
  percentageOfTotal: number
}

export type PeakHoursData = {
  hour: number
  appointmentCount: number
  revenue: number
}

export type StaffPerformance = {
  staffId: string
  staffName: string
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  totalRevenue: number
  avgRating: number | null
  utilizationRate: number
}

/**
 * Get service distribution breakdown
 * Legacy method - kept for backward compatibility
 */
export async function getServiceDistribution(
  salonId: string,
  dateFrom: string,
  dateTo: string
): Promise<ServiceDistribution[]> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Verify salon ownership
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (!salon || (salon as Salon).owner_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)
    .eq('status', 'completed')

  const appointmentsList = (appointments || []) as Appointment[]

  // Group by service
  const serviceMap = new Map<
    string,
    { count: number; revenue: number; durations: number[] }
  >()

  appointmentsList.forEach((apt) => {
    const serviceName = apt.service_names || 'Unknown Service'
    const existing = serviceMap.get(serviceName) || {
      count: 0,
      revenue: 0,
      durations: [],
    }

    existing.count += 1
    existing.revenue += apt.total_price || 0
    if (apt.duration_minutes) {
      existing.durations.push(apt.duration_minutes)
    }

    serviceMap.set(serviceName, existing)
  })

  const totalAppointments = appointmentsList.length

  return Array.from(serviceMap.entries()).map(([serviceName, data]) => ({
    serviceName,
    serviceCount: data.count,
    totalRevenue: data.revenue,
    avgDuration:
      data.durations.length > 0
        ? data.durations.reduce((a, b) => a + b, 0) / data.durations.length
        : 0,
    percentageOfTotal: totalAppointments > 0 ? (data.count / totalAppointments) * 100 : 0,
  }))
}

/**
 * Get peak hours analysis
 * Legacy method - kept for backward compatibility
 */
export async function getPeakHours(
  salonId: string,
  dateFrom: string,
  dateTo: string
): Promise<PeakHoursData[]> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Verify salon ownership
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (!salon || (salon as Salon).owner_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)
    .eq('status', 'completed')

  const appointmentsList = (appointments || []) as Appointment[]

  // Group by hour
  const hourMap = new Map<number, { count: number; revenue: number }>()

  appointmentsList.forEach((apt) => {
    if (apt.start_time) {
      const hour = new Date(apt.start_time).getHours()
      const existing = hourMap.get(hour) || { count: 0, revenue: 0 }
      existing.count += 1
      existing.revenue += apt.total_price || 0
      hourMap.set(hour, existing)
    }
  })

  // Fill in all hours 0-23
  const result: PeakHoursData[] = []
  for (let hour = 0; hour < 24; hour++) {
    const data = hourMap.get(hour) || { count: 0, revenue: 0 }
    result.push({
      hour,
      appointmentCount: data.count,
      revenue: data.revenue,
    })
  }

  return result
}

/**
 * Get staff performance metrics
 * Legacy method - kept for backward compatibility
 */
export async function getStaffPerformance(
  salonId: string,
  dateFrom: string,
  dateTo: string
): Promise<StaffPerformance[]> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Verify salon ownership
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (!salon || (salon as Salon).owner_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  // Get all staff
  const { data: staff } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)

  const staffList = (staff || []) as Staff[]
  if (staffList.length === 0) return []

  // Get appointments for each staff
  const staffPerformance: StaffPerformance[] = await Promise.all(
    staffList
      .filter((s) => s.id !== null)
      .map(async (member) => {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('staff_id', member.id!)  // Non-null assertion safe due to filter above
        .gte('start_time', dateFrom)
        .lte('start_time', dateTo)

      const appointmentsList = (appointments || []) as Appointment[]

      const totalAppointments = appointmentsList.length
      const completedAppointments = appointmentsList.filter(
        (apt) => apt.status === 'completed'
      ).length
      const cancelledAppointments = appointmentsList.filter(
        (apt) => apt.status === 'cancelled'
      ).length
      const totalRevenue = appointmentsList
        .filter((apt) => apt.status === 'completed')
        .reduce((sum, apt) => sum + (apt.total_price || 0), 0)

      // Calculate utilization (simplified - assumes available full-time)
      const daysDiff = Math.ceil(
        (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24)
      )
      const utilizationRate = daysDiff > 0 ? (completedAppointments / (daysDiff * 4)) * 100 : 0 // Assuming 4 appointments per day as baseline

      return {
        staffId: member.id!,  // Non-null assertion safe due to filter above
        staffName: member.full_name || 'Unknown',
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue,
        avgRating: null, // Would need ratings data
        utilizationRate,
      }
    })
  )

  return staffPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue)
}
