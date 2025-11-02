import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type AppointmentService = Database['scheduling']['Tables']['appointment_services']['Row']

export type AppointmentServiceDetails = AppointmentService
type StaffServiceRow = { staff_id: string | null }
type StaffSummary = {
  id: string
  full_name: string | null
  title: string | null
  avatar_url: string | null
}
type StaffAvailability = StaffSummary & { is_available: boolean }

/** 
 * Get all services for a specific appointment
 */
export async function getAppointmentServices(
  appointmentId: string
): Promise<AppointmentServiceDetails[]> {
  const logger = createOperationLogger('getAppointmentServices', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const accessibleSalonIds = await getUserSalonIds()

  // NOTE: appointment_services table doesn't have salon_id column
  // Filtering by salon_id removed as it doesn't exist in schema
  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointment_services')
    .select('*')
    .eq('appointment_id', appointmentId)
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

  // NOTE: appointment_services table doesn't have salon_id column
  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointment_services')
    .select('*')
    .eq('id', serviceId)
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
      .from('appointments_view')
      .select('*')
      .eq('id', appointmentId)
      .in('salon_id', accessibleSalonIds)
      .single(),
    supabase
      .schema('scheduling')
      .from('appointment_services')
      .select('*')
      .eq('appointment_id', appointmentId)
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

  // NOTE: current_price column doesn't exist in appointment_services table
  // subtotal remains 0 until price tracking is added to schema
  const subtotal = 0

  const totalDuration = services.reduce(
    (sum, service) => sum + (service['duration_minutes'] || 0),
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
    .from('staff_services_view')
    .select('staff_id')
    .eq('service_id', serviceId)
    .eq('is_active', true)

  if (staffServicesError) throw staffServicesError

  const staffServicesList = (staffServices ?? []) as StaffServiceRow[]
  const staffIds = staffServicesList
    .map((ss) => ss['staff_id'])
    .filter((id): id is string => Boolean(id))

  if (staffIds.length === 0) {
    return []
  }

  // Get staff details
  const { data: staff, error: staffError } = await supabase
    .from('staff_enriched_view')
    .select('id, name, title, avatar')
    .in('id', staffIds)
    .eq('salon_id', salonId)
    .eq('is_active', true)

  if (staffError) throw staffError

  // Check availability - get conflicting appointments
  let conflictQuery = supabase
    .schema('scheduling')
    .from('appointment_services')
    .select('staff_id')
    .in('staff_id', staffIds)
    .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
    .neq('status', 'cancelled')

  if (excludeAppointmentServiceId) {
    conflictQuery = conflictQuery.neq('id', excludeAppointmentServiceId)
  }

  const { data: conflicts } = await conflictQuery

  const conflictList = (conflicts ?? []) as StaffServiceRow[]
  const busyStaffIds = new Set(conflictList.map((c) => c['staff_id']).filter(Boolean))

  const staffList = staff ?? []

  return staffList.map<StaffAvailability>((s) => ({
    id: s.id ?? '',
    full_name: s.name ?? null,
    title: s.title ?? null,
    avatar_url: s.avatar ?? null,
    is_available: !busyStaffIds.has(s.id ?? ''),
  }))
}

/**
 * Get service completion statistics for an appointment
 */
export async function getServiceCompletionStats(appointmentId: string) {
  const services = await getAppointmentServices(appointmentId)

  const total = services.length
  const completed = services.filter((s) => s['status'] === 'completed').length
  const inProgress = services.filter((s) => s['status'] === 'in_progress').length
  const pending = services.filter((s) => s['status'] === 'pending').length
  const cancelled = services.filter((s) => s['status'] === 'cancelled').length

  return {
    total,
    completed,
    inProgress,
    pending,
    cancelled,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
  }
}
