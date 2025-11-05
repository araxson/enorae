'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { STRING_LIMITS } from '@/lib/config/constants'
import { logMutation } from '@/lib/observability/query-logger'

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
  const logger = logMutation('updateAppointmentStatus', { appointmentId, status, userId: session.user.id })
  const supabase = await createClient()

  try {
    // PERFORMANCE FIX: Fetch appointment and verify ownership in parallel with update
    // Before: 3 sequential queries (appointment -> staff -> update)
    // After: Fetch both then update (faster total time)
    const [appointmentResult, staffProfileResult] = await Promise.all([
      supabase
        .from('appointments_view')
        .select('staff_id')
        .eq('id', appointmentId)
        .single(),
      supabase
        .from('staff_profiles_view')
        .select('id, user_id')
        .eq('user_id', session.user.id)
        .single()
    ])

    const { data: appointment } = appointmentResult
    const { data: staffProfile } = staffProfileResult

    if (!appointment) {
      logger.error(new Error('Appointment not found'), 'not_found')
      return { success: false, error: 'Appointment not found' }
    }

    if (!staffProfile) {
      logger.error(new Error('Staff profile not found'), 'not_found')
      return { success: false, error: 'Staff profile not found. Please contact support.' }
    }

    // Verify the staff member owns this appointment
    const appt = appointment as { staff_id: string | null }
    if (appt.staff_id !== staffProfile.id) {
      logger.error(new Error('Unauthorized access attempt'), 'permission')
      return { success: false, error: 'You do not have permission to update this appointment' }
    }

    // Update status
    const { error } = await supabase
      .schema('scheduling')
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', appointmentId)

    if (error) {
      logger.error(error, 'database')
      console.error('Appointment status update error:', error)
      return { success: false, error: 'Failed to update appointment status. Please try again.' }
    }

    revalidatePath('/staff/appointments', 'page')
    revalidatePath('/staff', 'layout')
    logger.success({ appointmentId, status })
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'system')
    console.error('Unexpected error updating appointment status:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
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

  try {
    // PERFORMANCE FIX: Fetch appointment and staff profile in parallel
    // Before: 3 sequential queries (appointment -> staff -> update)
    // After: Fetch both in parallel then update (faster total time)
    const [appointmentResult, staffProfileResult] = await Promise.all([
      supabase
        .from('appointments_view')
        .select('staff_id')
        .eq('id', appointmentId)
        .single(),
      supabase
        .from('staff_profiles_view')
        .select('id')
        .eq('user_id', session.user.id)
        .single()
    ])

    const { data: appointment } = appointmentResult
    const { data: staffProfile } = staffProfileResult

    if (!appointment) {
      return { success: false, error: 'Appointment not found' }
    }

    if (!staffProfile) {
      return { success: false, error: 'Staff profile not found. Please contact support.' }
    }

    // Verify ownership
    const appt2 = appointment as { staff_id: string | null }
    if (appt2.staff_id !== staffProfile.id) {
      return { success: false, error: 'You do not have permission to cancel this appointment' }
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

    if (error) {
      console.error('Appointment cancellation error:', error)
      return { success: false, error: 'Failed to cancel appointment. Please try again.' }
    }

    revalidatePath('/staff/appointments', 'page')
    revalidatePath('/staff', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error cancelling appointment:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
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
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors
      }
    }

    const { appointmentId, serviceNotes, productsUsed, nextVisitRecommendations } = validation.data

    // PERFORMANCE FIX: Fetch appointment and staff profile in parallel
    // Before: 2 sequential queries (appointment -> staff)
    // After: Fetch both in parallel (faster total time)
    const [appointmentResult, staffProfileResult] = await Promise.all([
      supabase
        .from('appointments_view')
        .select('staff_id, customer_id, salon_id')
        .eq('id', appointmentId)
        .single<{ staff_id: string; customer_id: string; salon_id: string }>(),
      supabase
        .from('staff_profiles_view')
        .select('id')
        .eq('user_id', session.user.id)
        .single<{ id: string }>()
    ])

    const { data: appointment } = appointmentResult
    const { data: staffProfile } = staffProfileResult

    if (!appointment || !appointment.staff_id) {
      return { success: false, error: 'Appointment not found or not assigned to staff' }
    }

    if (!staffProfile) {
      return { success: false, error: 'Unauthorized: Cannot add notes to this appointment' }
    }

    // Verify ownership
    if (appointment.staff_id !== staffProfile.id) {
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

      if (error) {
        console.error('Error updating message thread:', error)
        return {
          success: false,
          error: 'Failed to update appointment notes. Please try again.'
        }
      }
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

      if (threadError) {
        console.error('Error creating message thread:', threadError)
        return {
          success: false,
          error: 'Failed to save appointment notes. Please try again.'
        }
      }
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
