import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import type { AppointmentService, Appointment, ServiceStats, StaffStats } from '../analytics.types'

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

  const supabase = await createClient()

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
  const serviceStats = new Map<string, ServiceStats>()

  appointmentServices.forEach((service) => {
    if (!service.service_id || !service.service_name) return

    if (!serviceStats.has(service.service_id)) {
      serviceStats.set(service.service_id, {
        name: service.service_name,
        count: 0,
        revenue: 0,
      })
    }

    const stats = serviceStats.get(service.service_id)!
    stats.count += 1
    stats.revenue += service.current_price || 0
  })

  return Array.from(serviceStats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
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
    .from('appointments')
    .select('staff_id, staff_name, staff_title, total_price')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .gte('start_time', startDate)
    .lte('start_time', endDate)

  if (error) throw error
  if (!data) return []

  const appointments = data as Appointment[]
  const stats = new Map<string, StaffStats>()

  appointments.forEach((appointment) => {
    if (!appointment.staff_id) return

    if (!stats.has(appointment.staff_id)) {
      stats.set(appointment.staff_id, {
        name: appointment.staff_name || 'Unknown',
        title: appointment.staff_title,
        count: 0,
        revenue: 0,
      })
    }

    const entry = stats.get(appointment.staff_id)!
    entry.count += 1
    entry.revenue += appointment.total_price || 0
  })

  return Array.from(stats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}
