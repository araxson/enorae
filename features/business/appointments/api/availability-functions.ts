'use server'

import 'server-only'

import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { UUID_REGEX } from '@/features/shared/service-pricing/api/shared'

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

  const { data, error } = await supabase.rpc('check_staff_availability', {
    p_staff_id: staffId,
    p_start_time: startTime.toISOString(),
    p_end_time: endTime.toISOString(),
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    available: Boolean(data),
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

  const { data, error } = await supabase.rpc('check_appointment_conflict', {
    p_salon_id: salonId,
    p_staff_id: staffId,
    p_start_time: startTime.toISOString(),
    p_end_time: endTime.toISOString(),
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    hasConflict: Boolean(data),
  }
}
