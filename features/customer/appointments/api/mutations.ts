'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const rescheduleSchema = z.object({
  newStartTime: z.string().datetime(),
  reason: z.string().optional(),
})

/**
 * Cancel an appointment
 * Enforces 24-hour cancellation policy
 */
export async function cancelAppointment(appointmentId: string): Promise<ActionResponse> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Verify ownership and get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('customer_id, start_time, status')
      .eq('id', appointmentId)
      .single()

    if (fetchError) throw fetchError

    if (!appointment) {
      return { success: false, error: 'Appointment not found' }
    }

    if (appointment.customer_id !== session.user.id) {
      return { success: false, error: 'Not authorized to cancel this appointment' }
    }

    // Check if already cancelled
    if (appointment.status === 'cancelled' || appointment.status === 'cancelled_by_customer') {
      return { success: false, error: 'Appointment is already cancelled' }
    }

    // Check 24-hour cancellation policy
    const hoursUntil =
      (new Date(appointment.start_time).getTime() - Date.now()) / (1000 * 60 * 60)

    if (hoursUntil < 24) {
      return {
        success: false,
        error: 'Cannot cancel within 24 hours of appointment. Please contact the salon directly.',
      }
    }

    // Cancel the appointment
    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('appointments')
      .update({
        status: 'cancelled_by_customer',
        cancelled_at: new Date().toISOString(),
        cancelled_by_id: session.user.id,
        updated_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', appointmentId)

    if (updateError) throw updateError

    revalidatePath('/customer/appointments')
    revalidatePath(`/customer/appointments/${appointmentId}`)

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel appointment',
    }
  }
}

/**
 * Request to reschedule an appointment
 * Creates a notification for the salon to review
 */
export async function requestReschedule(
  appointmentId: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Validate input
    const result = rescheduleSchema.safeParse({
      newStartTime: formData.get('newStartTime'),
      reason: formData.get('reason'),
    })

    if (!result.success) {
      return { success: false, error: result.error.errors[0].message }
    }

    const { newStartTime, reason } = result.data

    // Verify ownership and get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('customer_id, salon_id, staff_id, start_time, status')
      .eq('id', appointmentId)
      .single()

    if (fetchError) throw fetchError

    if (!appointment) {
      return { success: false, error: 'Appointment not found' }
    }

    if (appointment.customer_id !== session.user.id) {
      return { success: false, error: 'Not authorized to reschedule this appointment' }
    }

    // Check if appointment can be rescheduled
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return { success: false, error: `Cannot reschedule ${appointment.status} appointment` }
    }

    // Get salon owner for notification
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id, name')
      .eq('id', appointment.salon_id)
      .single()

    if (!salon) {
      return { success: false, error: 'Salon not found' }
    }

    // Create notification for salon owner
    const { error: notificationError } = await supabase
      .schema('communication')
      .from('notifications')
      .insert({
        user_id: salon.owner_id,
        type: 'reschedule_request',
        title: 'Reschedule Request',
        message: `Customer requests to reschedule appointment to ${new Date(newStartTime).toLocaleString()}`,
        data: {
          appointment_id: appointmentId,
          current_time: appointment.start_time,
          new_time: newStartTime,
          reason,
          customer_id: session.user.id,
        },
        created_at: new Date().toISOString(),
        created_by_id: session.user.id,
      })

    if (notificationError) throw notificationError

    // Update appointment to mark reschedule requested
    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('appointments')
      .update({
        status: 'pending_reschedule',
        updated_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', appointmentId)

    if (updateError) throw updateError

    revalidatePath('/customer/appointments')
    revalidatePath(`/customer/appointments/${appointmentId}`)

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error requesting reschedule:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to request reschedule',
    }
  }
}
