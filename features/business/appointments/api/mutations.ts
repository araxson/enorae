'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import {
  addServiceToAppointment as addServiceToAppointmentAction,
  updateAppointmentService as updateAppointmentServiceAction,
  removeServiceFromAppointment as removeServiceFromAppointmentAction,
  updateServiceStatus as updateServiceStatusAction,
  adjustServicePricing as adjustServicePricingAction,
} from './internal/appointment-services'
import {
  batchUpdateAppointmentStatus as batchUpdateAppointmentStatusAction,
  batchAssignStaff as batchAssignStaffAction,
  batchReschedule as batchRescheduleAction,
} from './internal/batch'
import {
  bulkCancelAppointments as bulkCancelAppointmentsAction,
  bulkConfirmAppointments as bulkConfirmAppointmentsAction,
  bulkCompleteAppointments as bulkCompleteAppointmentsAction,
  bulkNoShowAppointments as bulkNoShowAppointmentsAction,
} from './internal/bulk-operations'

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
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Validate input
  const validation = updateStatusSchema.safeParse({ appointmentId, status })
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()

  // Verify the appointment belongs to one of the user's salons
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .select('salon_id')
    .eq('id', appointmentId)
    .single()

  if (appointmentError) throw appointmentError
  if (!appointment) throw new Error('Appointment not found')

  const appointmentSalonId = (appointment as { salon_id: string | null }).salon_id
  if (!appointmentSalonId) {
    throw new Error('Appointment salon not found')
  }

  const authorized = await canAccessSalon(appointmentSalonId)
  if (!authorized) {
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

type ServerAction<T extends (...args: never[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: never[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const addServiceToAppointment = createServerActionProxy(addServiceToAppointmentAction)
export const updateAppointmentService = createServerActionProxy(updateAppointmentServiceAction)
export const removeServiceFromAppointment = createServerActionProxy(removeServiceFromAppointmentAction)
export const updateServiceStatus = createServerActionProxy(updateServiceStatusAction)
export const adjustServicePricing = createServerActionProxy(adjustServicePricingAction)

export const batchUpdateAppointmentStatus = createServerActionProxy(
  batchUpdateAppointmentStatusAction
)
export const batchAssignStaff = createServerActionProxy(batchAssignStaffAction)
export const batchReschedule = createServerActionProxy(batchRescheduleAction)

export const bulkCancelAppointments = createServerActionProxy(bulkCancelAppointmentsAction)
export const bulkConfirmAppointments = createServerActionProxy(bulkConfirmAppointmentsAction)
export const bulkCompleteAppointments = createServerActionProxy(bulkCompleteAppointmentsAction)
export const bulkNoShowAppointments = createServerActionProxy(bulkNoShowAppointmentsAction)
