'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

import { getAuthorizedContext } from './context'
import { UUID_REGEX, type DayOfWeek } from '../constants'
import type { ActionResult } from '../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function updateStaffSchedule(
  scheduleId: string,
  data: {
    staff_id?: string
    day_of_week?: DayOfWeek
    start_time?: string
    end_time?: string
    break_start?: string | null
    break_end?: string | null
    is_active?: boolean
  },
): Promise<ActionResult> {
  const logger = createOperationLogger('updateStaffSchedule', {})
  logger.start()

  try {
    if (!UUID_REGEX.test(scheduleId)) {
      return { success: false, error: 'Invalid schedule ID format' }
    }

    const { supabase, session, schedule } = await getAuthorizedContextForSchedule(scheduleId)

    if (!schedule.salon_id) {
      return { success: false, error: 'Schedule not found' }
    }

    const targetStaffId = data.staff_id ?? schedule.staff_id
    const targetDay = data.day_of_week ?? schedule.day_of_week

    const { data: conflicting } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .select('id')
      .eq('staff_id', targetStaffId)
      .eq('salon_id', schedule.salon_id)
      .eq('day_of_week', targetDay)
      .eq('is_active', true)
      .neq('id', scheduleId)
      .single()

    if (conflicting) {
      return { success: false, error: 'Schedule already exists for this day' }
    }

    const updates = {
      ...data,
      updated_by_id: session.user.id,
    }

    const { data: updated, error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .update(updates)
      .eq('id', scheduleId)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/business/staff/schedules', 'page')
    return { success: true, data: updated }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update schedule' }
  }
}

async function getAuthorizedContextForSchedule(scheduleId: string) {
  const supabase = await createClient()

  const { data: schedule } = await supabase
    .schema('scheduling')
    .from('staff_schedules')
    .select('salon_id, staff_id, day_of_week')
    .eq('id', scheduleId)
    .single<{ salon_id: string | null; staff_id: string; day_of_week: DayOfWeek }>()

  if (!schedule?.salon_id) {
    throw new Error('Schedule not found')
  }

  const contextResult = await getAuthorizedContext(schedule.salon_id)
  if (!contextResult.success) {
    throw new Error(contextResult.error)
  }

  return { ...contextResult.data, schedule }
}
