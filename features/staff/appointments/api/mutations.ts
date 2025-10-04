'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Get the appointment to verify ownership
  const { data: appointment } = await supabase
    .from('appointments')
    .select('staff_id')
    .eq('id', appointmentId)
    .single()

  if (!appointment) {
    throw new Error('Appointment not found')
  }

  // Verify the staff member owns this appointment
  const appt = appointment as { staff_id: string | null }
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', appt.staff_id!)
    .single()

  if (!staffProfile) {
    throw new Error('Unauthorized: Cannot update this appointment')
  }

  // Update status
  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', appointmentId)

  if (error) throw error

  revalidatePath('/staff/appointments')
  revalidatePath('/staff')
  return { success: true }
}

export async function markAppointmentCompleted(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'completed')
}

export async function markAppointmentNoShow(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'no_show')
}

export async function startAppointment(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'in_progress')
}

export async function confirmAppointment(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'confirmed')
}

export async function cancelAppointment(appointmentId: string) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Get the appointment to verify ownership
  const { data: appointment } = await supabase
    .from('appointments')
    .select('staff_id')
    .eq('id', appointmentId)
    .single()

  if (!appointment) {
    throw new Error('Appointment not found')
  }

  // Verify ownership
  const appt2 = appointment as { staff_id: string | null }
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', appt2.staff_id!)
    .single()

  if (!staffProfile) {
    throw new Error('Unauthorized')
  }

  // Cancel appointment
  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)

  if (error) throw error

  revalidatePath('/staff/appointments')
  revalidatePath('/staff')
  return { success: true }
}
