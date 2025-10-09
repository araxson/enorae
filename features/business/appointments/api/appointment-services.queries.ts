import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type AppointmentService = Database['public']['Views']['appointment_services']['Row']

export interface AppointmentServiceDetails extends AppointmentService {
  // View already has all the details we need
}

/**
 * Get all services for a specific appointment
 */
export async function getAppointmentServices(
  appointmentId: string
): Promise<AppointmentServiceDetails[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const accessibleSalonIds = await getUserSalonIds()

  const { data, error } = await supabase
    .from('appointment_services')
    .select('*')
    .eq('appointment_id', appointmentId)
    .in('salon_id', accessibleSalonIds)
    .order('start_time', { ascending: true })

  if (error) throw error
  return (data || []) as AppointmentServiceDetails[]
}

/**
 * Get a single appointment service by ID
 */
export async function getAppointmentServiceById(
  serviceId: string
): Promise<AppointmentServiceDetails | null> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const accessibleSalonIds = await getUserSalonIds()

  const { data, error } = await supabase
    .from('appointment_services')
    .select('*')
    .eq('id', serviceId)
    .in('salon_id', accessibleSalonIds)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as AppointmentServiceDetails
}

/**
 * Get appointment summary including services
 */
export async function getAppointmentWithServices(appointmentId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const accessibleSalonIds = await getUserSalonIds()

  const [appointment, services] = await Promise.all([
    supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .in('salon_id', accessibleSalonIds)
      .single(),
    supabase
      .from('appointment_services')
      .select('*')
      .eq('appointment_id', appointmentId)
      .in('salon_id', accessibleSalonIds)
      .order('start_time', { ascending: true }),
  ])

  if (appointment.error) throw appointment.error
  if (services.error) throw services.error

  return {
    appointment: appointment.data,
    services: (services.data || []) as AppointmentServiceDetails[],
  }
}

/**
 * Calculate total pricing for appointment services
 */
export async function calculateAppointmentServicePricing(appointmentId: string) {
  const services = await getAppointmentServices(appointmentId)

  const subtotal = services.reduce(
    (sum, service) => sum + (Number(service.current_price) || 0),
    0
  )

  const totalDuration = services.reduce(
    (sum, service) => sum + (service.duration_minutes || 0),
    0
  )

  return {
    services,
    subtotal,
    totalDuration,
    serviceCount: services.length,
  }
}

/**
 * Get available staff for a service
 */
export async function getAvailableStaffForService(
  salonId: string,
  serviceId: string,
  startTime: string,
  endTime: string,
  excludeAppointmentServiceId?: string
) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Get all staff who can perform this service
  const { data: staffServices, error: staffServicesError } = await supabase
    .from('staff_services')
    .select('staff_id')
    .eq('service_id', serviceId)
    .eq('is_active', true)

  if (staffServicesError) throw staffServicesError

  const staffIds = (staffServices || []).map((ss) => ss.staff_id).filter(Boolean)

  if (staffIds.length === 0) {
    return []
  }

  // Get staff details
  const { data: staff, error: staffError } = await supabase
    .from('staff')
    .select('id, full_name, title, avatar_url')
    .in('id', staffIds)
    .eq('salon_id', salonId)
    .eq('is_active', true)

  if (staffError) throw staffError

  // Check availability - get conflicting appointments
  let conflictQuery = supabase
    .from('appointment_services')
    .select('staff_id')
    .in('staff_id', staffIds)
    .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
    .neq('status', 'cancelled')

  if (excludeAppointmentServiceId) {
    conflictQuery = conflictQuery.neq('id', excludeAppointmentServiceId)
  }

  const { data: conflicts } = await conflictQuery

  const busyStaffIds = new Set((conflicts || []).map((c) => c.staff_id))

  return (staff || []).map((s) => ({
    ...s,
    is_available: !busyStaffIds.has(s.id),
  }))
}

/**
 * Get service completion statistics for an appointment
 */
export async function getServiceCompletionStats(appointmentId: string) {
  const services = await getAppointmentServices(appointmentId)

  const total = services.length
  const completed = services.filter((s) => s.status === 'completed').length
  const inProgress = services.filter((s) => s.status === 'in_progress').length
  const pending = services.filter((s) => s.status === 'pending').length
  const cancelled = services.filter((s) => s.status === 'cancelled').length

  return {
    total,
    completed,
    inProgress,
    pending,
    cancelled,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
  }
}
