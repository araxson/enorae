'use server'

import { revalidatePath } from 'next/cache'

import { scheduleSchema } from '../constants'
import { getAuthorizedContext } from './context'
import type { ActionResult } from '../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function createStaffSchedule(
  salonId: string,
  data: { staff_id: string; day_of_week: string; start_time: string; end_time: string; break_start?: string; break_end?: string; is_active?: boolean },
): Promise<ActionResult> {
  const logger = createOperationLogger('createStaffSchedule', {})
  logger.start()

  try {
    const validation = scheduleSchema.parse(data)
    const context = await getAuthorizedContext(salonId)

    if ('error' in context) {
      return context
    }

    const { supabase, session } = context

    const { data: existingSchedule } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .select('id')
      .eq('staff_id', validation.staff_id)
      .eq('salon_id', salonId)
      .eq('day_of_week', validation.day_of_week)
      .eq('is_active', true)
      .single()

    if (existingSchedule) {
      return { error: 'Schedule conflict: Staff member already has a schedule for this day' }
    }

    const { data: schedule, error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .insert({
        salon_id: salonId,
        staff_id: validation.staff_id,
        day_of_week: validation.day_of_week,
        start_time: validation.start_time,
        end_time: validation.end_time,
        break_start: validation.break_start || null,
        break_end: validation.break_end || null,
        is_active: validation.is_active,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/business/staff/schedules', 'page')
    return { success: true, data: schedule }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Failed to create schedule' }
  }
}
