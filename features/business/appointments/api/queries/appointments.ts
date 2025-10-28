import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { canAccessSalon } from '@/lib/auth/permissions/salon-access'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments_view']['Row']

export type AppointmentWithDetails = Appointment

export async function getAppointments(salonId: string) {
  console.log('Fetching appointments', { salonId })

  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    console.error('getAppointments unauthorized access attempt', {
      salonId,
      userId: session.user.id
    })
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('start_time', { ascending: false })

  if (error) {
    console.error('getAppointments query failed', {
      salonId,
      userId: session.user.id,
      error: error.message
    })
    throw error
  }

  console.log('getAppointments completed', {
    salonId,
    count: data?.length ?? 0,
    userId: session.user.id
  })

  return data as AppointmentWithDetails[]
}

export async function getAppointmentsByStatus(salonId: string, status: string) {
  console.log('Fetching appointments by status', { salonId, status })

  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    console.error('getAppointmentsByStatus unauthorized access attempt', {
      salonId,
      status,
      userId: session.user.id
    })
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', status as 'draft' | 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled')
    .order('start_time', { ascending: false })

  if (error) {
    console.error('getAppointmentsByStatus query failed', {
      salonId,
      status,
      userId: session.user.id,
      error: error.message
    })
    throw error
  }

  console.log('getAppointmentsByStatus completed', {
    salonId,
    status,
    count: data?.length ?? 0,
    userId: session.user.id
  })

  return data as AppointmentWithDetails[]
}
