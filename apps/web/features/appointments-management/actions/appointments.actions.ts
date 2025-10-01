'use server'

import { createClient } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)

  if (error) throw error

  revalidatePath('/business/appointments')
}

export async function confirmAppointment(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'confirmed')
}

export async function cancelAppointment(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'cancelled')
}

export async function markAsCompleted(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'completed')
}

export async function markAsNoShow(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'no_show')
}