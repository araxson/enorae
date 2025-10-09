import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { getUserSalon } from '../../shared/api/salon.queries'

type Appointment = Database['public']['Views']['appointments']['Row']

// IMPROVED: appointments view already includes customer/staff data
export type AppointmentWithDetails = Appointment

// Re-export getUserSalon from shared location
export { getUserSalon }

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
