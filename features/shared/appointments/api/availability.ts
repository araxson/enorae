'use server'

import 'server-only'

import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const availabilityInputSchema = z.object({
  staffId: z.string().regex(UUID_REGEX, 'Invalid staff ID'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
})

const conflictInputSchema = availabilityInputSchema.extend({
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
})

type AvailabilityArgs = {
  staffId: string
  startTime: string | Date
  endTime: string | Date
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

  const { staffId, startTime, endTime } = parsed.data

  const supabase = await createClient()

  // Check for conflicting appointments
  const { data: appointments, error: apptError } = await supabase
    .schema('scheduling')
    .from('appointments')
    .select('id')
    .eq('staff_id', staffId)
    .neq('status', 'cancelled')
    .or(`and(start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()})`)

  if (apptError) {
    throw new Error(apptError.message)
  }

  // Check for blocked times
  const { data: blockedTime } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .select('reason, block_type')
    .eq('staff_id', staffId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .lte('start_time', endTime.toISOString())
    .gte('end_time', startTime.toISOString())
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

  const { salonId, staffId, startTime, endTime } = parsed.data

  const supabase = await createClient()

  // Check for overlapping appointments
  const { data: conflicts, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .select('id')
    .eq('salon_id', salonId)
    .eq('staff_id', staffId)
    .neq('status', 'cancelled')
    .or(`and(start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()})`)

  if (error) {
    throw new Error(error.message)
  }

  return {
    hasConflict: Boolean(conflicts?.length),
  }
}

