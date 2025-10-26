'use server'

import 'server-only'

import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const availabilityInputSchema = z.object({
  staffId: z.string().regex(UUID_REGEX, 'Invalid staff ID'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  excludeAppointmentId: z.string().regex(UUID_REGEX, 'Invalid appointment ID').optional(),
})

const conflictInputSchema = availabilityInputSchema.extend({
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
})

type AvailabilityArgs = {
  staffId: string
  startTime: string | Date
  endTime: string | Date
  excludeAppointmentId?: string
}

type ConflictArgs = AvailabilityArgs & {
  salonId: string
}

type AvailabilityResult = {
  available: boolean
  reason?: string
  blockType?: string
}

type ConflictResult = {
  hasConflict: boolean
}

export async function checkStaffAvailability(params: AvailabilityArgs): Promise<AvailabilityResult> {
  const parsed = availabilityInputSchema.safeParse({
    staffId: params.staffId,
    startTime: params.startTime,
    endTime: params.endTime,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid availability input')
  }

  const { staffId, startTime, endTime, excludeAppointmentId } = parsed.data
  await requireAuth()

  const supabase = await createClient()
  const startIso = startTime.toISOString()
  const endIso = endTime.toISOString()

  // Check for conflicting appointments
  let appointmentQuery = supabase
    .from('appointments_view')
    .select('id')
    .eq('staff_id', staffId)
    .neq('status', 'cancelled')
    .lt('start_time', endIso)
    .gt('end_time', startIso)

  if (excludeAppointmentId) {
    appointmentQuery = appointmentQuery.neq('id', excludeAppointmentId)
  }

  const { data: appointments, error: apptError } = await appointmentQuery

  if (apptError) {
    throw new Error(apptError.message)
  }

  // Check for blocked times
  const { data: blockedTime } = await supabase
    .from('blocked_times_view')
    .select('reason, block_type')
    .eq('staff_id', staffId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .lt('start_time', endIso)
    .gt('end_time', startIso)
    .maybeSingle()

  const available = !appointments?.length && !blockedTime

  if (!available && blockedTime && typeof blockedTime === 'object') {
    return {
      available: false,
      reason: blockedTime.reason ?? undefined,
      blockType: blockedTime.block_type ?? undefined,
    }
  }

  return {
    available,
  }
}

export async function checkAppointmentConflict(params: ConflictArgs): Promise<ConflictResult> {
  const parsed = conflictInputSchema.safeParse({
    salonId: params.salonId,
    staffId: params.staffId,
    startTime: params.startTime,
    endTime: params.endTime,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid conflict check input')
  }

  const { salonId, staffId, startTime, endTime, excludeAppointmentId } = parsed.data
  await requireAuth()

  const supabase = await createClient()
  const startIso = startTime.toISOString()
  const endIso = endTime.toISOString()

  // Check for overlapping appointments
  let conflictQuery = supabase
    .from('appointments_view')
    .select('id')
    .eq('salon_id', salonId)
    .eq('staff_id', staffId)
    .neq('status', 'cancelled')
    .lt('start_time', endIso)
    .gt('end_time', startIso)

  if (excludeAppointmentId) {
    conflictQuery = conflictQuery.neq('id', excludeAppointmentId)
  }

  const { data: conflicts, error } = await conflictQuery

  if (error) {
    throw new Error(error.message)
  }

  return {
    hasConflict: Boolean(conflicts?.length),
  }
}
