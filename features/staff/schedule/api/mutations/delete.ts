'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

import { getAuthorizedContext } from './context'
import { UUID_REGEX } from '../constants'
import type { ActionResult } from '../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function deleteStaffSchedule(scheduleId: string): Promise<ActionResult> {
  const logger = createOperationLogger('deleteStaffSchedule', {})
  logger.start()

  try {
    if (!UUID_REGEX.test(scheduleId)) {
      return { success: false, error: 'Invalid schedule ID format' }
    }

    const supabase = await createClient()

    const { data: schedule } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .select('salon_id')
      .eq('id', scheduleId)
      .single<{ salon_id: string | null }>()

    if (!schedule?.salon_id) {
      return { success: false, error: 'Schedule not found' }
    }

    const contextResult = await getAuthorizedContext(schedule.salon_id)
    if (!contextResult.success) {
      return contextResult
    }

    const { supabase: client } = contextResult.data

    const { error } = await client
      .schema('scheduling')
      .from('staff_schedules')
      .delete()
      .eq('id', scheduleId)

    if (error) throw error

    revalidatePath('/business/staff/schedules', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete schedule' }
  }
}
