'use server'

// @ts-nocheck
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

  const { data, error } = await supabase
    .schema('scheduling')
    .rpc('check_staff_availability', {
      p_staff_id: staffId,
      p_start_time: startTime.toISOString(),
      p_end_time: endTime.toISOString(),
    })

  if (error) {
    throw new Error(error.message)
  }

  const available = Boolean(data)

  if (!available) {
    const { data: blockedTime } = await supabase
      .from('blocked_times')
      .select('reason, block_type')
      .eq('staff_id', staffId)
      .eq('is_active', true)
      .is('deleted_at', null)
      .lte('start_time', endTime.toISOString())
      .gte('end_time', startTime.toISOString())
      .maybeSingle()

    if (blockedTime && typeof blockedTime === 'object') {
      return {
        available: false,
        reason: (blockedTime as { reason?: string | null; block_type?: string | null }).reason || undefined,
        blockType: (blockedTime as { reason?: string | null; block_type?: string | null }).block_type || undefined,
      }
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

  const { data, error } = await supabase
    .schema('scheduling')
    .rpc('check_appointment_conflict', {
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

