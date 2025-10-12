import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export type StaffAppointment = Appointment

type Staff = Database['public']['Views']['staff']['Row']

export async function getStaffProfile(): Promise<Staff> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (error) throw new Error('Staff profile not found')
  return data
}

export async function getStaffAppointments(staffId: string, filter?: {
  status?: AppointmentStatus
  dateFrom?: string
  dateTo?: string
}): Promise<StaffAppointment[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  let query = supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)

  // Security: Double-check the staff member can only see their own appointments
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) {
    throw new Error('Unauthorized: Cannot view appointments for another staff member')
  }

  // Apply filters
  if (filter?.status) {
    query = query.eq('status', filter.status)
  }
  if (filter?.dateFrom) {
    query = query.gte('start_time', filter.dateFrom)
  }
  if (filter?.dateTo) {
    query = query.lte('start_time', filter.dateTo)
  }

  const { data, error } = await query.order('start_time', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getTodayAppointments(staffId: string): Promise<StaffAppointment[]> {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  return getStaffAppointments(staffId, {
    dateFrom: startOfDay,
    dateTo: endOfDay,
  })
}

export async function getUpcomingAppointments(staffId: string): Promise<StaffAppointment[]> {
  const now = new Date().toISOString()
  const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  return getStaffAppointments(staffId, {
    dateFrom: now,
    dateTo: oneMonthLater,
  })
}

export async function getPastAppointments(staffId: string, limit: number = 20): Promise<StaffAppointment[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  // Security check
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) {
    throw new Error('Unauthorized')
  }

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .lt('start_time', now)
    .order('start_time', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getAppointmentById(appointmentId: string): Promise<StaffAppointment | null> {
  const session = await requireAuth()
  const supabase = await createClient()

  // Get appointment and verify staff ownership
  const { data: appointment, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .single()

  if (error || !appointment) return null

  // Security: Verify this staff member owns this appointment
  const appt = appointment as { staff_id: string | null }
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', appt.staff_id!)
    .single()

  if (!staffProfile) {
    throw new Error('Unauthorized: Cannot view this appointment')
  }

  return appointment
}