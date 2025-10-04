'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { Database } from '@/lib/types/database.types'

// NOTE: Using Table type for Update because View includes computed fields
// Views are for SELECT, schema tables for mutations
type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const updateStatusSchema = z.object({
  appointmentId: z.string().regex(UUID_REGEX, 'Invalid appointment ID format'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
})

export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Validate input
  const validation = updateStatusSchema.safeParse({ appointmentId, status })
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  // CRITICAL SECURITY FIX: Verify ownership before allowing update
  // First, get the user's salon(s)
  const { data: userSalons, error: salonError } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', user.id)

  if (salonError) throw salonError
  if (!userSalons || userSalons.length === 0) {
    throw new Error('No salon found for user')
  }

  const salonIds = (userSalons as Array<{ id: string | null }>)
    .filter(s => s.id !== null)
    .map(s => s.id as string)

  // Verify the appointment belongs to one of the user's salons
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .select('salon_id')
    .eq('id', appointmentId)
    .single()

  if (appointmentError) throw appointmentError
  if (!appointment) throw new Error('Appointment not found')

  const appointmentSalonId = (appointment as { salon_id: string | null }).salon_id
  if (!appointmentSalonId || !salonIds.includes(appointmentSalonId)) {
    throw new Error('Unauthorized: Appointment does not belong to your salon')
  }

  // Now safe to update
  const updateData: AppointmentUpdate = { status }

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update(updateData)
    .eq('id', appointmentId)
    .eq('salon_id', appointmentSalonId) // Double-check with RLS

  if (error) throw error

  revalidatePath('/business/appointments')
  return { success: true }
}

export async function cancelAppointment(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'cancelled')
}

export async function confirmAppointment(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'confirmed')
}

export async function completeAppointment(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'completed')
}
