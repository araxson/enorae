'use server'

import { resolveContext, revalidateSchedules, type ActionResponse } from './shared'

export async function toggleScheduleActive(scheduleId: string, isActive: boolean): Promise<ActionResponse> {
  try {
    const { supabase, salonId } = await resolveContext()

    const { error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .update({ is_active: isActive })
      .eq('id', scheduleId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidateSchedules()
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error toggling schedule:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update schedule',
    }
  }
}
