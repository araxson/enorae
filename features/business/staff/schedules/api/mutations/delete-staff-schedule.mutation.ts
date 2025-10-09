'use server'

import { resolveContext, revalidateSchedules, type ActionResponse } from './shared'

export async function deleteStaffSchedule(scheduleId: string): Promise<ActionResponse> {
  try {
    const { supabase, salonId } = await resolveContext()

    const { data: schedule } = await supabase
      .from('staff_schedules')
      .select('salon_id')
      .eq('id', scheduleId)
      .single<{ salon_id: string | null }>()

    if (!schedule || schedule.salon_id !== salonId) {
      return { success: false, error: 'Schedule not found or access denied' }
    }

    const { error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .delete()
      .eq('id', scheduleId)

    if (error) throw error

    revalidateSchedules()
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error deleting staff schedule:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete schedule',
    }
  }
}
