import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

const ALLOWED_ROLES: Database['public']['Enums']['role_type'][] = [
  ...ROLE_GROUPS.BUSINESS_USERS,
  ...ROLE_GROUPS.ALL_STAFF,
]

type AppointmentRow = Database['scheduling']['Views']['appointments_with_counts']['Row']
type AppointmentStatus = Database['public']['Enums']['appointment_status']

async function getSalonContext() {
  await requireAnyRole(ALLOWED_ROLES)
  const salonId = await requireUserSalonId()
  if (!salonId) throw new Error('Unauthorized')

  const supabase = await createClient()
  return { supabase, salonId }
}

export async function getSalonAppointments(limit = 50): Promise<AppointmentRow[]> {
  const { supabase, salonId } = await getSalonContext()
  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments_with_counts')
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
    .schema('scheduling')
    .from('appointments_with_counts')
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
    .schema('scheduling')
    .from('appointments_with_counts')
    .select('*')
    .eq('salon_id', salonId)
    .eq('id', appointmentId)
    .maybeSingle()

  if (error) throw error
  return data ?? null
}
