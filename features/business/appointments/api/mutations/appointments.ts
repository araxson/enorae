'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'
import { logMutation } from '@/lib/observability/logger'

// NOTE: Internal modules './internal/appointment-services', './internal/batch', './internal/bulk-operations'
// do not exist in database. These features are disabled until the modules are created.
// Database is source of truth - cannot implement features without proper module structure.

// NOTE: Using Table type for Update because View includes computed fields
// Views are for SELECT, schema tables for mutations
type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const updateStatusSchema = z.object({
  appointmentId: z.string().regex(UUID_REGEX, 'Invalid appointment ID format'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
})

// FIX 6: Define valid status transitions
const validStatusTransitions: Record<string, string[]> = {
  draft: ['pending'],
  pending: ['confirmed', 'cancelled'],
  confirmed: ['checked_in', 'in_progress', 'cancelled'],
  checked_in: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'no_show'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
  no_show: [], // Terminal state
  rescheduled: [], // Terminal state
}

function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  const allowedStatuses = validStatusTransitions[currentStatus]
  if (!allowedStatuses) return false
  return allowedStatuses.includes(newStatus)
}

type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<ActionResult> {
  const logger = createOperationLogger('updateAppointmentStatus', { appointmentId })
  logger.start({ requestedStatus: status })

  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate input
    const validation = updateStatusSchema.safeParse({ appointmentId, status })
    if (!validation.success) {
      logger.error('Validation failed', 'validation', {
        userId: session.user.id,
        requestedStatus: status,
        fieldErrors: validation.error.flatten().fieldErrors
      })
      return { success: false, error: 'Validation failed. Please check your input.' }
    }

    const supabase = await createClient()

    // Verify the appointment belongs to one of the user's salons
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments_view')
      .select('salon_id, status')
      .eq('id', appointmentId)
      .single()

    if (appointmentError) {
      logger.error(appointmentError, 'database', { userId: session.user.id })
      return { success: false, error: 'Failed to fetch appointment' }
    }
    if (!appointment) {
      logger.error('Appointment not found', 'not_found', { userId: session.user.id })
      return { success: false, error: 'Appointment not found' }
    }

    // Type guard for appointment data
    if (!appointment || typeof appointment !== 'object') {
      logger.error('Invalid appointment data', 'validation')
      return { success: false, error: 'Invalid appointment data' }
    }

    const appointmentRecord = appointment as Record<string, unknown>
    const appointmentSalonId = typeof appointmentRecord['salon_id'] === 'string' ? appointmentRecord['salon_id'] : null
    const currentStatus = typeof appointmentRecord['status'] === 'string' ? appointmentRecord['status'] : null

    if (!appointmentSalonId) {
      logger.error('Appointment salon not found', 'validation')
      return { success: false, error: 'Appointment salon not found' }
    }

    // FIX 6: Validate status transition
    if (currentStatus && !isValidStatusTransition(currentStatus, status)) {
      logger.error(`Cannot transition from ${currentStatus} to ${status}`, 'validation', {
        userId: session.user.id,
        salonId: appointmentSalonId,
        currentStatus,
        requestedStatus: status,
      })
      return { success: false, error: `Cannot transition from ${currentStatus} to ${status}` }
    }

    const authorized = await canAccessSalon(appointmentSalonId)
    if (!authorized) {
      logger.error('Unauthorized: Appointment does not belong to your salon', 'permission', {
        userId: session.user.id,
        salonId: appointmentSalonId,
      })
      return { success: false, error: 'Unauthorized: Appointment does not belong to your salon' }
    }

    // Now safe to update
    const updateData: AppointmentUpdate = { status }

    const { error } = await supabase
      .schema('scheduling')
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .eq('salon_id', appointmentSalonId) // Double-check with RLS

    if (error) {
      logger.error(error, 'database', {
        userId: session.user.id,
        salonId: appointmentSalonId,
        requestedStatus: status,
      })
      return { success: false, error: 'Failed to update appointment status' }
    }

    logMutation('update_status', 'appointment', appointmentId, {
      userId: session.user.id,
      salonId: appointmentSalonId,
      operationName: 'updateAppointmentStatus',
      changes: { oldStatus: currentStatus, newStatus: status },
    })

    revalidatePath('/business/appointments', 'page')

    logger.success({
      userId: session.user.id,
      salonId: appointmentSalonId,
      oldStatus: currentStatus,
      newStatus: status,
    })

    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { success: false, error: 'An unexpected error occurred' }
  }
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

// Stub implementations for missing internal modules
// NOTE: These functions require internal modules that do not exist in the database
// Database is source of truth - these features cannot be implemented until proper modules are created
// SECURITY: Return error objects instead of throwing to comply with Server Action patterns

export async function addServiceToAppointment(_data: unknown): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/appointment-services does not exist'
  }
}

export async function updateAppointmentService(_data: unknown): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/appointment-services does not exist'
  }
}

export async function removeServiceFromAppointment(_data: unknown): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/appointment-services does not exist'
  }
}

export async function updateServiceStatus(_data: unknown): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/appointment-services does not exist'
  }
}

export async function adjustServicePricing(_data: unknown): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/appointment-services does not exist'
  }
}

export async function batchUpdateAppointmentStatus(_data: unknown): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/batch does not exist'
  }
}

export async function batchAssignStaff(_data: unknown): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/batch does not exist'
  }
}

export async function batchReschedule(_data: unknown): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/batch does not exist'
  }
}

export async function bulkCancelAppointments(_ids: string[], _reason?: string): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/bulk-operations does not exist'
  }
}

export async function bulkConfirmAppointments(_ids: string[]): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/bulk-operations does not exist'
  }
}

export async function bulkCompleteAppointments(_ids: string[]): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/bulk-operations does not exist'
  }
}

export async function bulkNoShowAppointments(_ids: string[]): Promise<ActionResult> {
  return {
    success: false,
    error: 'This feature is not yet implemented. Internal module ./internal/bulk-operations does not exist'
  }
}
