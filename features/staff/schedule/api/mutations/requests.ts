'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

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
  const logger = createOperationLogger('requestScheduleChange', {})
  logger.start()

  const session = await requireAuth()
  const supabase = await createClient()

  // Get staff profile
  const { data: staffProfileData } = await supabase
    .from('staff_profiles_view')
    .select('id, salon_id')
    .eq('user_id', session.user.id)
    .single()

  const staffProfile = (staffProfileData ?? null) as Pick<StaffRow, 'id' | 'salon_id'> | null

  if (!staffProfile) throw new Error('Staff profile not found')

  // Verify schedule ownership
  const { data: scheduleData } = await supabase
    .from('staff_schedules_view')
    .select('staff_id')
    .eq('id', scheduleId)
    .single()

  const schedule = (scheduleData ?? null) as Pick<StaffScheduleRow, 'staff_id'> | null

  if (!schedule || schedule.staff_id !== staffProfile.id) {
    throw new Error('Unauthorized')
  }

  // TODO: Implement notification creation when RPC function types are available
  console.log('[Schedule] Would notify management of schedule change request:', {
    scheduleId,
    newStartTime,
    newEndTime,
    reason,
  })

  revalidatePath('/staff/schedule', 'page')
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
    .from('staff_profiles_view')
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
    .from('staff_schedules_view')
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
    .from('staff_profiles_view')
    .select('user_id, full_name')
    .eq('id', targetStaffId)
    .eq('salon_id', staffProfile.salon_id)
    .single()

  const targetStaff = (targetStaffData ?? null) as Pick<StaffRow, 'user_id' | 'full_name'> | null

  if (!targetStaff?.user_id) {
    throw new Error('Target staff not found')
  }

  // TODO: Implement notification creation when RPC function types are available
  console.log('[Schedule] Would notify staff of shift swap request:', {
    targetStaffId,
    scheduleId,
    message,
  })

  revalidatePath('/staff/schedule', 'page')
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
    .from('staff_profiles_view')
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

  revalidatePath('/staff/schedule', 'page')
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
    .from('staff_profiles_view')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  const staffProfile = (staffProfileData ?? null) as Pick<StaffRow, 'id'> | null

  if (!staffProfile) throw new Error('Staff profile not found')

  // Verify ownership
  const { data: scheduleData } = await supabase
    .from('staff_schedules_view')
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

  revalidatePath('/staff/schedule', 'page')
  return { success: true }
}
