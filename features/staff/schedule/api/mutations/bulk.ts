'use server'

import { revalidatePath } from 'next/cache'

import { getAuthorizedContext } from './context'
import { UUID_REGEX, type DayOfWeek } from '../constants'
import type { ActionResult } from '../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function bulkCreateSchedules(
  salonId: string,
  staffId: string,
  schedules: Array<{
    day_of_week: DayOfWeek
    start_time: string
    end_time: string
    break_start?: string
    break_end?: string
    is_active: boolean
  }>,
): Promise<ActionResult> {
  const logger = createOperationLogger('bulkCreateSchedules', {})
  logger.start()

  try {
    if (!UUID_REGEX.test(salonId) || !UUID_REGEX.test(staffId)) {
      return { error: 'Invalid ID format' }
    }

    const context = await getAuthorizedContext(salonId)
    if ('error' in context) {
      return context
    }

    const { supabase, session } = context

    // PERFORMANCE FIX: Check all schedules in one query instead of N+1
    const daysToCheck = schedules.map((s) => s.day_of_week)
    const { data: existingSchedules } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .select('day_of_week')
      .eq('staff_id', staffId)
      .eq('salon_id', salonId)
      .in('day_of_week', daysToCheck)
      .eq('is_active', true)

    if (existingSchedules && existingSchedules.length > 0) {
      const existingDays = existingSchedules.map((s) => s.day_of_week).join(', ')
      return { error: `Schedule already exists for ${existingDays}` }
    }

    const { data: created, error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .insert(
        schedules.map((item) => ({
          salon_id: salonId,
          staff_id: staffId,
          day_of_week: item.day_of_week,
          start_time: item.start_time,
          end_time: item.end_time,
          break_start: item.break_start || null,
          break_end: item.break_end || null,
          is_active: item.is_active,
          created_by_id: session.user.id,
          updated_by_id: session.user.id,
        })),
      )
      .select()

    if (error) throw error

    revalidatePath('/business/staff/schedules', 'page')
    return { success: true, data: created }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Failed to create schedules' }
  }
}
