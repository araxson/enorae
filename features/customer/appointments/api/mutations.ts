'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { rescheduleSchema } from '@/lib/validations/customer/appointments'
import type { Database } from '@/lib/types/database.types'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

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
      .from('appointments_view')
      .select('customer_id, start_time, status')
      .eq('id', appointmentId)
      .eq('customer_id', session.user.id)
      .limit(1)
      .maybeSingle<Pick<Database['public']['Views']['appointments_view']['Row'], 'customer_id' | 'start_time' | 'status'>>()

    if (fetchError) throw fetchError

    if (!appointment) {
      return { success: false, error: 'Appointment not found' }
    }

    if (appointment.customer_id !== session.user.id) {
      return { success: false, error: 'Not authorized to cancel this appointment' }
    }

    // Check if already cancelled
    if (appointment.status === 'cancelled') {
      return { success: false, error: 'Appointment is already cancelled' }
    }

    // Check 24-hour cancellation policy
    if (!appointment.start_time) {
      return { success: false, error: 'Invalid appointment start time' }
    }
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
        status: 'cancelled',
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
      .from('appointments_view')
      .select('customer_id, salon_id, staff_id, start_time, status')
      .eq('id', appointmentId)
      .eq('customer_id', session.user.id)
      .limit(1)
      .maybeSingle<Pick<
        Database['public']['Views']['appointments_view']['Row'],
        'customer_id' | 'salon_id' | 'staff_id' | 'start_time' | 'status'
      >>()

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
    if (!appointment.salon_id) {
      return { success: false, error: 'Invalid salon ID' }
    }

    const { data: salon, error: salonError } = await supabase
      .from('salons_view')
      .select('id, name, is_active')
      .eq('id', appointment.salon_id)
      .limit(1)
      .maybeSingle<Pick<Database['public']['Views']['salons_view']['Row'], 'id' | 'name' | 'is_active'>>()

    if (salonError) throw salonError

    if (!salon || salon.is_active === false) {
      return { success: false, error: 'Salon not available' }
    }

    // Create message thread for reschedule request
    const { error: threadError } = await supabase
      .schema('communication')
      .from('message_threads')
      .insert({
        salon_id: appointment.salon_id,
        customer_id: session.user.id,
        staff_id: appointment.staff_id,
        appointment_id: appointmentId,
        subject: 'Reschedule Request',
        status: 'open',
        priority: 'high',
        last_message_at: new Date().toISOString(),
        last_message_by_id: session.user.id,
        unread_count_staff: 1,
        metadata: {
          reschedule_request: {
            current_time: appointment.start_time,
            new_time: newStartTime,
            reason,
          },
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (threadError) throw threadError

    // Update appointment to mark reschedule requested (using 'pending' status)
    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('appointments')
      .update({
        status: 'pending',
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
