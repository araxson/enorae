'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

type ScheduleInput = {
  staffId: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  breakStart?: string | null
  breakEnd?: string | null
  effectiveFrom?: string | null
  effectiveUntil?: string | null
}

/**
 * Create or update staff schedule
 */
export async function upsertStaffSchedule(
  schedule: ScheduleInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    // Verify the staff member belongs to this salon
    const { data: targetStaff } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('id', schedule.staffId)
      .single<{ salon_id: string | null }>()

    if (!targetStaff || targetStaff.salon_id !== staffProfile.salon_id) {
      return { success: false, error: 'Staff member not found or access denied' }
    }

    // Check if schedule exists for this staff and day
    const { data: existing } = await supabase
      .from('staff_schedules')
      .select('id')
      .eq('staff_id', schedule.staffId)
      .eq('day_of_week', schedule.dayOfWeek)
      .eq('salon_id', staffProfile.salon_id)
      .maybeSingle<{ id: string }>()

    if (existing) {
      // Update existing schedule
      const { data, error } = await supabase
        .schema('scheduling')
        .from('staff_schedules')
        .update({
          start_time: schedule.startTime,
          end_time: schedule.endTime,
          break_start: schedule.breakStart || null,
          break_end: schedule.breakEnd || null,
          effective_from: schedule.effectiveFrom || null,
          effective_until: schedule.effectiveUntil || null,
        })
        .eq('id', existing.id)
        .select('id')
        .single<{ id: string }>()

      if (error) throw error
      revalidatePath('/business/staff/schedules')
      return { success: true, data: { id: data.id } }
    } else {
      // Create new schedule
      const { data, error } = await supabase
        .schema('scheduling')
        .from('staff_schedules')
        .insert({
          staff_id: schedule.staffId,
          salon_id: staffProfile.salon_id,
          day_of_week: schedule.dayOfWeek,
          start_time: schedule.startTime,
          end_time: schedule.endTime,
          break_start: schedule.breakStart || null,
          break_end: schedule.breakEnd || null,
          effective_from: schedule.effectiveFrom || null,
          effective_until: schedule.effectiveUntil || null,
          is_active: true,
        })
        .select('id')
        .single<{ id: string }>()

      if (error) throw error
      revalidatePath('/business/staff/schedules')
      return { success: true, data: { id: data.id } }
    }
  } catch (error) {
    console.error('Error upserting staff schedule:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save schedule',
    }
  }
}

/**
 * Delete staff schedule
 */
export async function deleteStaffSchedule(scheduleId: string): Promise<ActionResponse> {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    // Verify the schedule belongs to this salon
    const { data: schedule } = await supabase
      .from('staff_schedules')
      .select('salon_id')
      .eq('id', scheduleId)
      .single<{ salon_id: string | null }>()

    if (!schedule || schedule.salon_id !== staffProfile.salon_id) {
      return { success: false, error: 'Schedule not found or access denied' }
    }

    const { error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .delete()
      .eq('id', scheduleId)

    if (error) throw error

    revalidatePath('/business/staff/schedules')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error deleting staff schedule:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete schedule',
    }
  }
}

/**
 * Toggle schedule active status
 */
export async function toggleScheduleActive(
  scheduleId: string,
  isActive: boolean
): Promise<ActionResponse> {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    const { error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .update({ is_active: isActive })
      .eq('id', scheduleId)
      .eq('salon_id', staffProfile.salon_id)

    if (error) throw error

    revalidatePath('/business/staff/schedules')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error toggling schedule:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update schedule',
    }
  }
}
