'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

export async function batchUpdateAppointmentStatus(
  appointmentIds: string[],
  newStatus: string,
  reason?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Update appointments directly
  type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']
  const updateData: AppointmentUpdate = {
    status: newStatus as Database['public']['Enums']['appointment_status'],
    updated_at: new Date().toISOString(),
  }

  // Note: cancellation_reason is not stored in appointments table
  // If needed in future, could be stored in a related table or notes field

  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update(updateData)
    .in('id', appointmentIds)
    .select('id')

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
