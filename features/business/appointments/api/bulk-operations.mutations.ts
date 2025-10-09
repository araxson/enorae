'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function batchUpdateAppointmentStatus(
  appointmentIds: string[],
  newStatus: string,
  reason?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('batch_update_appointment_status', {
      p_appointment_ids: appointmentIds,
      p_new_status: newStatus,
      p_reason: reason || null,
    })

  if (error) throw error

  revalidatePath('/business/appointments')
  return data
}

export async function bulkCancelAppointments(
  appointmentIds: string[],
  reason: string
) {
  return batchUpdateAppointmentStatus(appointmentIds, 'cancelled', reason)
}

export async function bulkConfirmAppointments(appointmentIds: string[]) {
  return batchUpdateAppointmentStatus(appointmentIds, 'confirmed')
}

export async function bulkCompleteAppointments(appointmentIds: string[]) {
  return batchUpdateAppointmentStatus(appointmentIds, 'completed')
}

export async function bulkNoShowAppointments(appointmentIds: string[]) {
  return batchUpdateAppointmentStatus(appointmentIds, 'no_show')
}
