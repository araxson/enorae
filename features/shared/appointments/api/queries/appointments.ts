import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

const ALLOWED_ROLES: Database['public']['Enums']['role_type'][] = [
  ...ROLE_GROUPS.BUSINESS_USERS,
  ...ROLE_GROUPS.ALL_STAFF,
]

type AppointmentRow = Database['public']['Views']['admin_appointments_overview_view']['Row']
type AppointmentStatus = Database['public']['Enums']['appointment_status']

async function getSalonContext() {
  await requireAnyRole(ALLOWED_ROLES)
  const salonId = await requireUserSalonId()
  if (!salonId) throw new Error('Unauthorized')

  const supabase = await createClient()
  return { supabase, salonId }
}

export async function getSalonAppointments(limit = 50): Promise<AppointmentRow[]> {
  const logger = createOperationLogger('getSalonAppointments', {})
  logger.start()

  const { supabase, salonId } = await getSalonContext()
  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('start_time', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function getSalonAppointmentsByStatus(
  status: AppointmentStatus,
  limit = 50,
): Promise<AppointmentRow[]> {
  const { supabase, salonId } = await getSalonContext()
  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', status)
    .order('start_time', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function getAppointmentDetails(
  appointmentId: string,
): Promise<AppointmentRow | null> {
  const { supabase, salonId } = await getSalonContext()
  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('id', appointmentId)
    .maybeSingle()

  if (error) throw error
  return data ?? null
}
