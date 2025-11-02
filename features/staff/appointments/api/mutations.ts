'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { STRING_LIMITS } from '@/lib/config/constants'

import type { Database } from '@/lib/types/database.types'

export type AppointmentStatus = Database['public']['Enums']['appointment_status']

const appointmentNotesSchema = z.object({
  appointmentId: z.string().uuid(),
  serviceNotes: z.string().max(STRING_LIMITS.DESCRIPTION).optional(),
  productsUsed: z.array(z.string()).optional(),
  nextVisitRecommendations: z.string().max(STRING_LIMITS.REASON).optional(),
})

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Get the appointment to verify ownership
  const { data: appointment } = await supabase
    .from('appointments_view')
    .select('staff_id')
    .eq('id', appointmentId)
    .single()

  if (!appointment) {
    throw new Error('Appointment not found')
  }

  // Verify the staff member owns this appointment
  const appt = appointment as { staff_id: string | null }
  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
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

  revalidatePath('/staff/appointments', 'page')
  revalidatePath('/staff', 'layout')
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
    .from('appointments_view')
    .select('staff_id')
    .eq('id', appointmentId)
    .single()

  if (!appointment) {
    throw new Error('Appointment not found')
  }

  // Verify ownership
  const appt2 = appointment as { staff_id: string | null }
  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
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

  revalidatePath('/staff/appointments', 'page')
  revalidatePath('/staff', 'layout')
  return { success: true }
}

/**
 * Add notes to an appointment after service completion
 * Notes include service details, products used, and recommendations
 */
export async function addAppointmentNotes(
  data: z.infer<typeof appointmentNotesSchema>
) {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const validation = appointmentNotesSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || "Validation failed" }
    }

    const { appointmentId, serviceNotes, productsUsed, nextVisitRecommendations } = validation.data

    // Verify appointment ownership
    const { data: appointment } = await supabase
      .from('appointments_view')
      .select('staff_id, customer_id, salon_id')
      .eq('id', appointmentId)
      .single<{ staff_id: string; customer_id: string; salon_id: string }>()

    if (!appointment || !appointment.staff_id) {
      return { success: false, error: 'Appointment not found or not assigned to staff' }
    }

  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('id', appointment.staff_id)
      .single<{ id: string }>()

    if (!staffProfile) {
      return { success: false, error: 'Unauthorized: Cannot add notes to this appointment' }
    }

    // Store notes in message_threads metadata for appointment
    const { data: existingThread } = await supabase
      .schema('communication')
      .from('message_threads')
      .select('id, metadata')
      .eq('appointment_id', appointmentId)
      .single<{ id: string; metadata: Record<string, unknown> | null }>()

    const noteData = {
      service_notes: serviceNotes,
      products_used: productsUsed || [],
      next_visit_recommendations: nextVisitRecommendations,
      created_by: session.user.id,
      created_at: new Date().toISOString(),
    }

    if (existingThread?.id) {
      // Update existing thread with notes
      const { error } = await supabase
        .schema('communication')
        .from('message_threads')
        .update({
          metadata: {
            ...(existingThread.metadata ?? {}),
            appointment_notes: noteData,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingThread.id)

      if (error) throw error
    } else {
      // Create new thread for appointment notes
      const { error: threadError } = await supabase
        .schema('communication')
        .from('message_threads')
        .insert({
          salon_id: appointment.salon_id,
          customer_id: appointment.customer_id,
          staff_id: appointment.staff_id,
          appointment_id: appointmentId,
          subject: 'Appointment Notes',
          status: 'open',
          priority: 'normal',
          metadata: {
            appointment_notes: noteData,
          },
        })

      if (threadError) throw threadError
    }

    revalidatePath('/staff/appointments', 'page')
    revalidatePath(`/staff/appointments/${appointmentId}`, 'page')
    return { success: true }
  } catch (error) {
    console.error('Error adding appointment notes:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add appointment notes',
    }
  }
}
