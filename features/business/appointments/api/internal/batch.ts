'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']
type AppointmentView = Database['public']['Views']['appointments']['Row']
type AppointmentSalonReference = Pick<AppointmentView, 'id' | 'salon_id'>

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Batch update appointment statuses
 */
const batchUpdateStatusSchema = z.object({
  appointmentIds: z.array(z.string().regex(UUID_REGEX)),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  reason: z.string().optional(),
})

export async function batchUpdateAppointmentStatus(
  appointmentIds: string[],
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  reason?: string
) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const validation = batchUpdateStatusSchema.safeParse({
    appointmentIds,
    status,
    reason,
  })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  if (appointmentIds.length === 0) {
    throw new Error('No appointments selected')
  }

  const supabase = await createClient()

  // Verify all appointments belong to user's salons
  const { data: appointments, error: fetchError } = await supabase
    .from('appointments')
    .select('id, salon_id')
    .in('id', appointmentIds)
    .returns<AppointmentSalonReference[]>()

  if (fetchError) throw fetchError
  if (!appointments || appointments.length === 0) {
    throw new Error('No appointments found')
  }

  // Check authorization for each salon
  const salonIds = [...new Set(appointments.map((appointment) => appointment.salon_id))]
  for (const salonId of salonIds) {
    if (!salonId) continue
    const authorized = await canAccessSalon(salonId)
    if (!authorized) {
      throw new Error(`Unauthorized: Cannot access appointments from salon ${salonId}`)
    }
  }

  // Update all appointments
  const updateData: AppointmentUpdate = { status }

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update(updateData)
    .in('id', appointmentIds)

  if (error) throw error

  revalidatePath('/business/appointments')
  return {
    success: true,
    updated: appointmentIds.length,
    status,
  }
}

/**
 * Batch assign staff to appointments
 */
const batchAssignStaffSchema = z.object({
  appointmentIds: z.array(z.string().regex(UUID_REGEX)),
  staffId: z.string().regex(UUID_REGEX),
})

export async function batchAssignStaff(appointmentIds: string[], staffId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const validation = batchAssignStaffSchema.safeParse({
    appointmentIds,
    staffId,
  })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  if (appointmentIds.length === 0) {
    throw new Error('No appointments selected')
  }

  const supabase = await createClient()

  // Verify appointments belong to user's salons
  const { data: appointments, error: fetchError } = await supabase
    .from('appointments')
    .select('id, salon_id')
    .in('id', appointmentIds)
    .returns<AppointmentSalonReference[]>()

  if (fetchError) throw fetchError
  if (!appointments || appointments.length === 0) {
    throw new Error('No appointments found')
  }

  // Check authorization
  const salonIds = [...new Set(appointments.map((appointment) => appointment.salon_id))]
  for (const salonId of salonIds) {
    if (!salonId) continue
    const authorized = await canAccessSalon(salonId)
    if (!authorized) {
      throw new Error(`Unauthorized: Cannot access appointments from salon ${salonId}`)
    }
  }

  // Verify staff belongs to one of the salons
  const { data: staff, error: staffError } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('id', staffId)
    .single<{ salon_id: string | null }>()

  if (staffError) throw staffError
  if (!staff) throw new Error('Staff member not found')

  const staffSalonId = staff.salon_id
  if (!staffSalonId || !salonIds.includes(staffSalonId)) {
    throw new Error('Staff member does not belong to the appointment salons')
  }

  // Update appointments
  const updateData: AppointmentUpdate = { staff_id: staffId }

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update(updateData)
    .in('id', appointmentIds)

  if (error) throw error

  revalidatePath('/business/appointments')
  return {
    success: true,
    updated: appointmentIds.length,
    staffId,
  }
}

/**
 * Batch reschedule appointments
 */
const batchRescheduleSchema = z.object({
  appointmentIds: z.array(z.string().regex(UUID_REGEX)),
  newStartTime: z.string().datetime(),
  durationMinutes: z.number().int().positive().optional(),
})

export async function batchReschedule(
  appointmentIds: string[],
  newStartTime: string,
  durationMinutes?: number
) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const validation = batchRescheduleSchema.safeParse({
    appointmentIds,
    newStartTime,
    durationMinutes,
  })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  if (appointmentIds.length === 0) {
    throw new Error('No appointments selected')
  }

  const supabase = await createClient()

  // Verify appointments
  const { data: appointments, error: fetchError } = await supabase
    .from('appointments')
    .select('id, salon_id, duration_minutes')
    .in('id', appointmentIds)

  if (fetchError) throw fetchError

  const appointmentRows =
    (appointments as Pick<AppointmentView, 'id' | 'salon_id' | 'duration_minutes'>[] | null | undefined) ?? []

  if (appointmentRows.length === 0) {
    throw new Error('No appointments found')
  }

  // Check authorization
  const salonIds = [...new Set(appointmentRows.map((appointment) => appointment.salon_id))]
  for (const salonId of salonIds) {
    if (!salonId) continue
    const authorized = await canAccessSalon(salonId)
    if (!authorized) {
      throw new Error(`Unauthorized: Cannot access appointments from salon ${salonId}`)
    }
  }

  // Calculate end time
  const startDate = new Date(newStartTime)
  const duration = durationMinutes || appointmentRows[0].duration_minutes || 60
  const endDate = new Date(startDate.getTime() + duration * 60000)

  // Update appointments
  const updateData: AppointmentUpdate = {
    start_time: startDate.toISOString(),
    end_time: endDate.toISOString(),
    ...(durationMinutes && { duration_minutes: durationMinutes }),
  }

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update(updateData)
    .in('id', appointmentIds)

  if (error) throw error

  revalidatePath('/business/appointments')
  return {
    success: true,
    updated: appointmentIds.length,
    newStartTime,
  }
}

/**
 * Batch cancel appointments
 */
const batchCancelSchema = z.object({
  appointmentIds: z.array(z.string().regex(UUID_REGEX)),
  reason: z.string().min(1, 'Cancellation reason is required'),
})

export async function batchCancelAppointments(appointmentIds: string[], reason: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const validation = batchCancelSchema.safeParse({
    appointmentIds,
    reason,
  })

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  if (appointmentIds.length === 0) {
    throw new Error('No appointments selected')
  }

  const supabase = await createClient()

  // Verify appointments
  const { data: appointments, error: fetchError } = await supabase
    .from('appointments')
    .select('id, salon_id, status')
    .in('id', appointmentIds)

  if (fetchError) throw fetchError

  const appointmentRows =
    (appointments as Pick<AppointmentView, 'id' | 'salon_id' | 'status'>[] | null | undefined) ?? []

  if (appointmentRows.length === 0) {
    throw new Error('No appointments found')
  }

  // Check authorization
  const salonIds = [...new Set(appointmentRows.map((appointment) => appointment.salon_id))]
  for (const salonId of salonIds) {
    if (!salonId) continue
    const authorized = await canAccessSalon(salonId)
    if (!authorized) {
      throw new Error(`Unauthorized: Cannot access appointments from salon ${salonId}`)
    }
  }

  // Update status to cancelled
  const updateData: AppointmentUpdate = { status: 'cancelled' }

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update(updateData)
    .in('id', appointmentIds)

  if (error) throw error

  revalidatePath('/business/appointments')
  return {
    success: true,
    cancelled: appointmentIds.length,
    reason,
  }
}
