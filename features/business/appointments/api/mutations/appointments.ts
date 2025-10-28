'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

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

export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) {
  console.log('Starting updateAppointmentStatus', { appointmentId, status, timestamp: new Date().toISOString() })

  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Validate input
  const validation = updateStatusSchema.safeParse({ appointmentId, status })
  if (!validation.success) {
    const validationError = validation.error.issues[0]?.message ?? 'Validation failed'
    console.error('updateAppointmentStatus validation failed', {
      appointmentId,
      requestedStatus: status,
      userId: session.user.id,
      error: validationError
    })
    throw new Error(validationError)
  }

  const supabase = await createClient()

  // Verify the appointment belongs to one of the user's salons
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments_view')
    .select('salon_id, status')
    .eq('id', appointmentId)
    .single()

  if (appointmentError) {
    console.error('updateAppointmentStatus database error', {
      appointmentId,
      userId: session.user.id,
      error: appointmentError.message
    })
    throw appointmentError
  }
  if (!appointment) {
    console.error('updateAppointmentStatus not found', { appointmentId, userId: session.user.id })
    throw new Error('Appointment not found')
  }

  // Type guard for appointment data
  const appointmentData = appointment as unknown
  if (typeof appointmentData !== 'object' || appointmentData === null) {
    throw new Error('Invalid appointment data')
  }

  const appointmentTyped = appointmentData as { salon_id?: string | null; status?: string | null }
  const appointmentSalonId = appointmentTyped.salon_id
  const currentStatus = appointmentTyped.status

  if (!appointmentSalonId) {
    throw new Error('Appointment salon not found')
  }

  // FIX 6: Validate status transition
  if (currentStatus && !isValidStatusTransition(currentStatus, status)) {
    console.error('updateAppointmentStatus invalid transition', {
      appointmentId,
      currentStatus,
      requestedStatus: status,
      userId: session.user.id,
      salonId: appointmentSalonId
    })
    throw new Error(`Cannot transition from ${currentStatus} to ${status}`)
  }

  const authorized = await canAccessSalon(appointmentSalonId)
  if (!authorized) {
    console.error('updateAppointmentStatus unauthorized access attempt', {
      appointmentId,
      userId: session.user.id,
      salonId: appointmentSalonId
    })
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

  if (error) {
    console.error('updateAppointmentStatus update failed', {
      appointmentId,
      status,
      userId: session.user.id,
      salonId: appointmentSalonId,
      error: error.message
    })
    throw error
  }

  console.log('updateAppointmentStatus completed successfully', {
    appointmentId,
    oldStatus: currentStatus,
    newStatus: status,
    userId: session.user.id,
    salonId: appointmentSalonId
  })

  revalidatePath('/business/appointments', 'page')
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

// Stub implementations for missing internal modules
// TODO: Implement these properly when internal modules are created

export async function addServiceToAppointment(_data: unknown) {
  throw new Error('addServiceToAppointment: Internal module ./internal/appointment-services does not exist')
}

export async function updateAppointmentService(_data: unknown) {
  throw new Error('updateAppointmentService: Internal module ./internal/appointment-services does not exist')
}

export async function removeServiceFromAppointment(_data: unknown) {
  throw new Error('removeServiceFromAppointment: Internal module ./internal/appointment-services does not exist')
}

export async function updateServiceStatus(_data: unknown) {
  throw new Error('updateServiceStatus: Internal module ./internal/appointment-services does not exist')
}

export async function adjustServicePricing(_data: unknown) {
  throw new Error('adjustServicePricing: Internal module ./internal/appointment-services does not exist')
}

export async function batchUpdateAppointmentStatus(_data: unknown) {
  throw new Error('batchUpdateAppointmentStatus: Internal module ./internal/batch does not exist')
}

export async function batchAssignStaff(_data: unknown) {
  throw new Error('batchAssignStaff: Internal module ./internal/batch does not exist')
}

export async function batchReschedule(_data: unknown) {
  throw new Error('batchReschedule: Internal module ./internal/batch does not exist')
}

export async function bulkCancelAppointments(_ids: string[], _reason?: string) {
  throw new Error('bulkCancelAppointments: Internal module ./internal/bulk-operations does not exist')
}

export async function bulkConfirmAppointments(_ids: string[]) {
  throw new Error('bulkConfirmAppointments: Internal module ./internal/bulk-operations does not exist')
}

export async function bulkCompleteAppointments(_ids: string[]) {
  throw new Error('bulkCompleteAppointments: Internal module ./internal/bulk-operations does not exist')
}

export async function bulkNoShowAppointments(_ids: string[]) {
  throw new Error('bulkNoShowAppointments: Internal module ./internal/bulk-operations does not exist')
}
