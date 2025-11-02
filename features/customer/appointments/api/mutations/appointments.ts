'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { rescheduleSchema } from '@/features/customer/appointments/api/validation'
import type { Database } from '@/lib/types/database.types'
import { MILLISECONDS_PER_HOUR, APPOINTMENT_CANCELLATION_HOURS } from '@/lib/constants/time'
import { createOperationLogger, logMutation } from '@/lib/observability'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Cancel an appointment
 * Enforces cancellation policy (minimum hours before appointment)
 */
export async function cancelAppointment(appointmentId: string): Promise<ActionResponse> {
  const logger = createOperationLogger('cancelAppointment', { appointmentId })
  logger.start()

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    logger.start({ userId: session.user.id, customerId: session.user.id })

    // Verify ownership and get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments_view')
      .select('customer_id, start_time, status')
      .eq('id', appointmentId)
      .eq('customer_id', session.user.id)
      .limit(1)
      .maybeSingle<Pick<Database['public']['Views']['appointments_view']['Row'], 'customer_id' | 'start_time' | 'status'>>()

    if (fetchError) {
      logger.error(fetchError, 'database')
      throw fetchError
    }

    if (!appointment) {
      logger.warn('Appointment not found', { appointmentId, userId: session.user.id })
      return { success: false, error: 'Appointment not found' }
    }

    if (appointment.customer_id !== session.user.id) {
      logger.error('Not authorized to cancel this appointment', 'permission', {
        appointmentId,
        userId: session.user.id,
      })
      return { success: false, error: 'Not authorized to cancel this appointment' }
    }

    // Check if already cancelled
    if (appointment.status === 'cancelled') {
      logger.warn('Appointment already cancelled', { appointmentId })
      return { success: false, error: 'Appointment is already cancelled' }
    }

    // Check cancellation policy
    if (!appointment.start_time) {
      logger.error('Invalid appointment start time', 'validation')
      return { success: false, error: 'Invalid appointment start time' }
    }
    const hoursUntil =
      (new Date(appointment.start_time).getTime() - Date.now()) / MILLISECONDS_PER_HOUR

    if (hoursUntil < APPOINTMENT_CANCELLATION_HOURS) {
      logger.warn('Cancellation policy violation', { hoursUntil, policyHours: APPOINTMENT_CANCELLATION_HOURS })
      return {
        success: false,
        error: `Cannot cancel within ${APPOINTMENT_CANCELLATION_HOURS} hours of appointment. Please contact the salon directly.`,
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

    if (updateError) {
      logger.error(updateError, 'database')
      throw updateError
    }

    logMutation('cancel', 'appointment', appointmentId, {
      userId: session.user.id,
      operationName: 'cancelAppointment',
      changes: { status: 'cancelled' },
    })

    revalidatePath('/customer/appointments', 'page')
    revalidatePath(`/customer/appointments/${appointmentId}`, 'page')

    logger.success({ appointmentId })
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
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
  const logger = createOperationLogger('requestReschedule', { appointmentId })
  logger.start()

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Validate input
    const result = rescheduleSchema.safeParse({
      newStartTime: formData.get('newStartTime'),
      reason: formData.get('reason'),
    })

    if (!result.success) {
      logger.error(result.error.issues[0]?.message ?? 'Validation failed', 'validation')
      return { success: false, error: result.error.issues[0]?.message ?? 'Validation failed' }
    }

    const { newStartTime, reason } = result.data

    logger.start({ userId: session.user.id, customerId: session.user.id })

    // Verify ownership and get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from('admin_appointments_overview_view')
      .select('customer_id, salon_id, staff_id, start_time, status')
      .eq('id', appointmentId)
      .eq('customer_id', session.user.id)
      .limit(1)
      .maybeSingle<Pick<
        Database['public']['Views']['admin_appointments_overview_view']['Row'],
        'customer_id' | 'salon_id' | 'staff_id' | 'start_time' | 'status'
      >>()

    if (fetchError) {
      logger.error(fetchError, 'database')
      throw fetchError
    }

    if (!appointment) {
      logger.warn('Appointment not found')
      return { success: false, error: 'Appointment not found' }
    }

    if (appointment.customer_id !== session.user.id) {
      logger.error('Not authorized to reschedule this appointment', 'permission')
      return { success: false, error: 'Not authorized to reschedule this appointment' }
    }

    // Check if appointment can be rescheduled
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      logger.warn(`Cannot reschedule ${appointment.status} appointment`, { status: appointment.status })
      return { success: false, error: `Cannot reschedule ${appointment.status} appointment` }
    }

    // Get salon owner for notification
    if (!appointment.salon_id) {
      logger.error('Invalid salon ID', 'validation')
      return { success: false, error: 'Invalid salon ID' }
    }

    const { data: salon, error: salonError } = await supabase
      .from('salons_view')
      .select('id, name, is_active')
      .eq('id', appointment.salon_id)
      .limit(1)
      .maybeSingle<Pick<Database['public']['Views']['salons_view']['Row'], 'id' | 'name' | 'is_active'>>()

    if (salonError) {
      logger.error(salonError, 'database')
      throw salonError
    }

    if (!salon || salon.is_active === false) {
      logger.warn('Salon not available', { salonId: appointment.salon_id })
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

    if (threadError) {
      logger.error(threadError, 'database')
      throw threadError
    }

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

    if (updateError) {
      logger.error(updateError, 'database')
      throw updateError
    }

    logMutation('reschedule_request', 'appointment', appointmentId, {
      userId: session.user.id,
      salonId: appointment.salon_id,
      operationName: 'requestReschedule',
      changes: { status: 'pending', newTime: newStartTime, reason },
    })

    revalidatePath('/customer/appointments', 'page')
    revalidatePath(`/customer/appointments/${appointmentId}`, 'page')

    logger.success({ appointmentId, salonId: appointment.salon_id })
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to request reschedule',
    }
  }
}
