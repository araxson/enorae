'use server'

import { revalidatePath } from 'next/cache'

import { getAuthorizedContext } from './context'
import { UUID_REGEX, type DayOfWeek } from './constants'
import type { ActionResult } from './types'

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
  try {
    if (!UUID_REGEX.test(salonId) || !UUID_REGEX.test(staffId)) {
      return { error: 'Invalid ID format' }
    }

    const context = await getAuthorizedContext(salonId)
    if ('error' in context) {
      return context
    }

    const { supabase, session } = context

    for (const schedule of schedules) {
      const { data: existing } = await supabase
        .schema('scheduling')
        .from('staff_schedules')
        .select('id')
        .eq('staff_id', staffId)
        .eq('salon_id', salonId)
        .eq('day_of_week', schedule.day_of_week)
        .eq('is_active', true)
        .single()

      if (existing) {
        return { error: `Schedule already exists for ${schedule.day_of_week}` }
      }
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

    revalidatePath('/business/staff/schedules')
    return { success: true, data: created }
  } catch (error) {
    console.error('Error creating bulk schedules:', error)
    return { error: error instanceof Error ? error.message : 'Failed to create schedules' }
  }
}
