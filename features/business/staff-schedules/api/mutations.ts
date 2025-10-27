'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

export type DayOfWeek = Database['public']['Enums']['day_of_week']

export type ActionResponse = {
  success: boolean
  error?: string
}

export type UpsertPayload = {
  staffId: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  breakStart?: string | null
  breakEnd?: string | null
  effectiveFrom?: string | null
  effectiveUntil?: string | null
}

export async function upsertStaffSchedule(
  payload: UpsertPayload
): Promise<ActionResponse> {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()
    const supabase = await createClient()

    // FIX 3: Validate break times before saving
    if (payload.breakStart || payload.breakEnd) {
      if (!payload.breakStart || !payload.breakEnd) {
        return { success: false, error: 'Both break start and end times must be provided' }
      }

      // Validate break times are within shift (TIME format HH:mm)
      if (payload.breakStart >= payload.breakEnd) {
        return { success: false, error: 'Break end time must be after break start time' }
      }

      if (payload.breakStart < payload.startTime) {
        return { success: false, error: 'Break cannot start before shift start time' }
      }

      if (payload.breakEnd > payload.endTime) {
        return { success: false, error: 'Break cannot end after shift end time' }
      }
    }

    const insertPayload: Database['scheduling']['Tables']['staff_schedules']['Insert'] = {
      staff_id: payload.staffId,
      salon_id: salonId,
      day_of_week: payload.dayOfWeek,
      start_time: payload.startTime,
      end_time: payload.endTime,
      break_start: payload.breakStart ?? null,
      break_end: payload.breakEnd ?? null,
      effective_from: payload.effectiveFrom ?? null,
      effective_until: payload.effectiveUntil ?? null,
      is_active: true,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
    }

    const { error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .upsert(insertPayload)

    if (error) throw error

    revalidatePath('/business/staff-schedules', 'page')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save schedule'
    return { success: false, error: message }
  }
}

export async function deleteStaffSchedule(
  scheduleId: string
): Promise<ActionResponse> {
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()
    const supabase = await createClient()

    const { error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .delete()
      .eq('id', scheduleId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/staff-schedules', 'page')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete schedule'
    return { success: false, error: message }
  }
}

export async function toggleScheduleActive(
  scheduleId: string,
  isActive: boolean
): Promise<ActionResponse> {
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()
    const supabase = await createClient()

    const { error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .update({ is_active: isActive })
      .eq('id', scheduleId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/staff-schedules', 'page')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update schedule'
    return { success: false, error: message }
  }
}
