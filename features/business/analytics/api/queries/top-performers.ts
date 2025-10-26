import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import type { AppointmentService, Appointment, ServiceStats, StaffStats } from '@/features/business/analytics/api/analytics.types'

export type ServicePerformance = ServiceStats
export type StaffPerformance = StaffStats

export async function getTopServices(
  salonId: string,
  startDate: string,
  endDate: string,
  limit: number = 10
): Promise<ServicePerformance[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  // NOTE: appointment_services table exists in scheduling schema but doesn't have
  // service_name, current_price columns, and doesn't have salon_id filter capability
  // This function cannot work without an enriched view
  return []

  /* DISABLED - appointment_services lacks required columns
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointment_services')
    .select('service_id, status, appointment_id')
    .eq('status', 'completed')
    .gte('start_time', startDate)
    .lte('start_time', endDate)

  if (error) throw error
  if (!data) return []

  const appointmentServices = data as AppointmentService[]
  const serviceStats = new Map<string, ServiceStats>()

  appointmentServices.forEach((service) => {
    if (!service['service_id']) return

    if (!serviceStats.has(service['service_id'])) {
      serviceStats.set(service['service_id'], {
        name: 'Unknown Service', // service_name doesn't exist
        count: 0,
        revenue: 0, // current_price doesn't exist
      })
    }

    const stats = serviceStats.get(service['service_id'])!
    stats.count += 1
  })

  return Array.from(serviceStats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
  */
}

export async function getTopStaff(
  salonId: string,
  startDate: string,
  endDate: string,
  limit: number = 10
): Promise<StaffPerformance[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments_view')
    .select('staff_id')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .gte('start_time', startDate)
    .lte('start_time', endDate)

  if (error) throw error
  if (!data) return []

  const appointments = data as Appointment[]
  const stats = new Map<string, StaffStats>()

  appointments.forEach((appointment) => {
    if (!appointment['staff_id']) return

    if (!stats.has(appointment['staff_id'])) {
      stats.set(appointment['staff_id'], {
        name: 'Unknown', // staff_name doesn't exist in appointments_view
        title: 'Unknown', // staff_name doesn't exist
        count: 0,
        revenue: 0, // total_price doesn't exist in appointments_view
      })
    }

    const entry = stats.get(appointment['staff_id'])!
    entry.count += 1
    // NOTE: revenue remains 0 because total_price doesn't exist
  })

  return Array.from(stats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}
