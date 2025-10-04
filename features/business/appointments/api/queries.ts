import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']
type Salon = Database['public']['Views']['salons']['Row']

// IMPROVED: appointments view already includes customer/staff data
export type AppointmentWithDetails = Appointment

/**
 * Get user's salon
 * IMPROVED: Uses centralized requireUserSalonId() helper
 */
export async function getUserSalon(): Promise<Salon> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon ID (throws if not found)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (error) throw error
  return data as Salon
}

export async function getAppointments(salonId: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // IMPROVED: appointments view already includes customer/staff data
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data as AppointmentWithDetails[]
}

export async function getAppointmentsByStatus(salonId: string, status: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // IMPROVED: appointments view already includes customer/staff data
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', status)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data as AppointmentWithDetails[]
}
