'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type StaffRow = {
  id: string
  user_id: string
  salon_id: string
  full_name: string
  email: string
}

type StaffScheduleRow = {
  id: string
  staff_id: string
  salon_id: string
  day_of_week: string
  start_time: string
  end_time: string
  break_start: string | null
  break_end: string | null
  effective_from: string
  effective_until: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

type StaffScheduleUpdate = Database['scheduling']['Tables']['staff_schedules']['Update']

const STAFF_SCHEDULES_TABLE = 'staff_schedules' satisfies keyof Database['scheduling']['Tables']

export async function requestScheduleChange(
  scheduleId: string,
  newStartTime: string,
  newEndTime: string,
  reason: string
) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Get staff profile
  const { data: staffProfileData } = await supabase
    .from('staff')
    .select('id, salon_id')
    .eq('user_id', session.user.id)
    .single()

  const staffProfile = (staffProfileData ?? null) as Pick<StaffRow, 'id' | 'salon_id'> | null

  if (!staffProfile) throw new Error('Staff profile not found')

  // Verify schedule ownership
  const { data: scheduleData } = await supabase
    .from('staff_schedules')
    .select('staff_id')
    .eq('id', scheduleId)
    .single()

  const schedule = (scheduleData ?? null) as Pick<StaffScheduleRow, 'staff_id'> | null

  if (!schedule || schedule.staff_id !== staffProfile.id) {
    throw new Error('Unauthorized')
  }

  // Create notification for management
  const { error } = await supabase
    .schema('communication')
    .rpc('send_notification', {
      p_user_id: session.user.id,
      p_type: 'schedule_change_request',
      p_title: 'Schedule Change Request',
      p_message: `Staff member has requested a schedule change. New time: ${newStartTime} - ${newEndTime}. Reason: ${reason}`,
      p_data: {
        schedule_id: scheduleId,
        new_start_time: newStartTime,
        new_end_time: newEndTime,
        reason,
        staff_id: staffProfile.id,
      },
      p_channels: ['in_app'],
    })

  if (error) throw error

  revalidatePath('/staff/schedule')
  return { success: true }
}

export async function requestShiftSwap(
  scheduleId: string,
  targetStaffId: string,
  message?: string
) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Get staff profile
  const { data: staffProfileData } = await supabase
    .from('staff')
    .select('id, full_name, salon_id')
    .eq('user_id', session.user.id)
    .single()

  const staffProfile = (staffProfileData ?? null) as Pick<
    StaffRow,
    'id' | 'full_name' | 'salon_id'
  > | null

  if (!staffProfile) throw new Error('Staff profile not found')

  // Verify schedule ownership
  const { data: scheduleData } = await supabase
    .from('staff_schedules')
    .select('staff_id, day_of_week, start_time, end_time')
    .eq('id', scheduleId)
    .single()

  const schedule = (scheduleData ?? null) as Pick<
    StaffScheduleRow,
    'staff_id' | 'day_of_week' | 'start_time' | 'end_time'
  > | null

  if (!schedule || schedule.staff_id !== staffProfile.id) {
    throw new Error('Unauthorized')
  }

  // Get target staff user_id
  const { data: targetStaffData } = await supabase
    .from('staff')
    .select('user_id, full_name')
    .eq('id', targetStaffId)
    .eq('salon_id', staffProfile.salon_id)
    .single()

  const targetStaff = (targetStaffData ?? null) as Pick<StaffRow, 'user_id' | 'full_name'> | null

  if (!targetStaff?.user_id) {
    throw new Error('Target staff not found')
  }

  // Send notification to target staff
  const { error: targetError } = await supabase
    .schema('communication')
    .rpc('send_notification', {
      p_user_id: targetStaff.user_id,
      p_type: 'shift_swap_request',
      p_title: 'Shift Swap Request',
      p_message: `${staffProfile.full_name} has requested to swap shifts with you. ${schedule.day_of_week} ${schedule.start_time}-${schedule.end_time}${message ? `. Message: ${message}` : ''}`,
      p_data: {
        schedule_id: scheduleId,
        from_staff_id: staffProfile.id,
        to_staff_id: targetStaffId,
        message,
      },
      p_channels: ['in_app'],
    })

  if (targetError) throw targetError

  // Send notification to management
  const { error: managementError } = await supabase
    .schema('communication')
    .rpc('send_notification', {
      p_user_id: session.user.id,
      p_type: 'shift_swap_request',
      p_title: 'Shift Swap Request Pending',
      p_message: `Shift swap request sent to ${targetStaff.full_name}. Awaiting approval.`,
      p_data: {
        schedule_id: scheduleId,
        from_staff_id: staffProfile.id,
        to_staff_id: targetStaffId,
      },
      p_channels: ['in_app'],
    })

  if (managementError) throw managementError

  revalidatePath('/staff/schedule')
  return { success: true }
}

export async function createRecurringSchedule(
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
  startTime: string,
  endTime: string,
  breakStart?: string,
  breakEnd?: string,
  effectiveFrom?: string,
  effectiveUntil?: string
) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Get staff profile
  const { data: staffProfileData } = await supabase
    .from('staff')
    .select('id, salon_id')
    .eq('user_id', session.user.id)
    .single()

  const staffProfile = (staffProfileData ?? null) as Pick<StaffRow, 'id' | 'salon_id'> | null

  if (!staffProfile) throw new Error('Staff profile not found')

  const insertPayload: Database['scheduling']['Tables']['staff_schedules']['Insert'] = {
    staff_id: staffProfile.id,
    salon_id: staffProfile.salon_id,
    day_of_week: dayOfWeek,
    start_time: startTime,
    end_time: endTime,
    break_start: breakStart || null,
    break_end: breakEnd || null,
    effective_from: effectiveFrom || new Date().toISOString().split('T')[0],
    effective_until: effectiveUntil || null,
    is_active: true,
    created_by_id: session.user.id,
    updated_by_id: session.user.id,
  }

  const { error } = await supabase
    .schema('scheduling')
    .from(STAFF_SCHEDULES_TABLE)
    .insert(insertPayload)

  if (error) throw error

  revalidatePath('/staff/schedule')
  return { success: true }
}

export async function updateRecurringSchedule(
  scheduleId: string,
  updates: {
    startTime?: string
    endTime?: string
    breakStart?: string
    breakEnd?: string
    effectiveUntil?: string
    isActive?: boolean
  }
) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Get staff profile
  const { data: staffProfileData } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  const staffProfile = (staffProfileData ?? null) as Pick<StaffRow, 'id'> | null

  if (!staffProfile) throw new Error('Staff profile not found')

  // Verify ownership
  const { data: scheduleData } = await supabase
    .from('staff_schedules')
    .select('staff_id')
    .eq('id', scheduleId)
    .single()

  const schedule = (scheduleData ?? null) as Pick<StaffScheduleRow, 'staff_id'> | null

  if (!schedule || schedule.staff_id !== staffProfile.id) {
    throw new Error('Unauthorized')
  }

  const updateData: StaffScheduleUpdate = {
    updated_at: new Date().toISOString(),
  }

  if (updates.startTime) updateData.start_time = updates.startTime
  if (updates.endTime) updateData.end_time = updates.endTime
  if (updates.breakStart !== undefined) updateData.break_start = updates.breakStart || null
  if (updates.breakEnd !== undefined) updateData.break_end = updates.breakEnd || null
  if (updates.effectiveUntil !== undefined) updateData.effective_until = updates.effectiveUntil || null
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive

  updateData.updated_by_id = session.user.id

  const { error } = await supabase
    .schema('scheduling')
    .from('staff_schedules')
    .update<StaffScheduleUpdate>(updateData)
    .eq('id', scheduleId)

  if (error) throw error

  revalidatePath('/staff/schedule')
  return { success: true }
}
