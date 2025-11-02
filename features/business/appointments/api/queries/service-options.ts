import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getSalonContext, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

export type ServiceOption = {
  id: string
  name: string
}

export type StaffOption = {
  id: string
  name: string
}

export type AppointmentServiceOptions = {
  services: ServiceOption[]
  staff: StaffOption[]
}

/**
 * Get available services and staff for adding to an appointment
 * Used by Add/Edit Service dialogs
 */
export async function getAppointmentServiceOptions(
  appointmentId: string
): Promise<AppointmentServiceOptions> {
  const logger = createOperationLogger('getAppointmentServiceOptions', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const { activeSalonId } = await getSalonContext()

  if (!activeSalonId) {
    throw new Error('No active salon selected')
  }

  // Get appointment to verify access
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments_view')
    .select('id, salon_id')
    .eq('id', appointmentId)
    .single()

  if (appointmentError) throw appointmentError
  if (!appointment) throw new Error('Appointment not found')

  const appointmentSalonId = (appointment as { salon_id?: string }).salon_id
  if (appointmentSalonId !== activeSalonId) {
    throw new Error('Cannot access appointment from different salon')
  }

  // Fetch services and staff in parallel
  const [servicesResult, staffResult] = await Promise.all([
    supabase
      .from('services_view')
      .select('id, name')
      .eq('salon_id', activeSalonId)
      .eq('is_active', true)
      .order('name', { ascending: true }),
    supabase
      .from('staff_enriched_view')
      .select('id, name')
      .eq('salon_id', activeSalonId)
      .eq('is_active', true)
      .order('name', { ascending: true }),
  ])

  if (servicesResult.error) throw servicesResult.error
  if (staffResult.error) throw staffResult.error

  const services = (servicesResult.data ?? []) as Array<{ id: string; name: string | null }>
  const staff = (staffResult.data ?? []) as Array<{ id: string; name: string | null }>

  return {
    services: services.map((s) => ({
      id: s.id,
      name: s.name || 'Unnamed Service',
    })),
    staff: staff.map((s) => ({
      id: s.id,
      name: s.name || 'Unnamed Staff',
    })),
  }
}
