'use server'

import { z } from 'zod'
import { resolveContext, ensureStaffAccess, revalidateSchedules, schedulingTable, type ActionResponse, type DayOfWeek } from './shared'

const upsertSchema = z.object({
  staffId: z.string().uuid(),
  dayOfWeek: z.enum([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ] as const),
  startTime: z.string(),
  endTime: z.string(),
  breakStart: z.string().nullable().optional(),
  breakEnd: z.string().nullable().optional(),
  effectiveFrom: z.string().nullable().optional(),
  effectiveUntil: z.string().nullable().optional(),
})

export type ScheduleInput = z.infer<typeof upsertSchema>

const STAFF_SCHEDULES_TABLE = schedulingTable('staff_schedules')

export async function upsertStaffSchedule(schedule: ScheduleInput): Promise<ActionResponse<{ id: string }>> {
  try {
    const { supabase, session, salonId } = await resolveContext()

    await ensureStaffAccess(supabase, schedule.staffId, salonId)

    const { data: existing } = await supabase
      .from('staff_schedules')
      .select('id')
      .eq('staff_id', schedule.staffId)
      .eq('day_of_week', schedule.dayOfWeek)
      .eq('salon_id', salonId)
      .maybeSingle<{ id: string }>()

    const payload = {
      staff_id: schedule.staffId,
      salon_id: salonId,
      day_of_week: schedule.dayOfWeek,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      break_start: schedule.breakStart || null,
      break_end: schedule.breakEnd || null,
      effective_from: schedule.effectiveFrom || null,
      effective_until: schedule.effectiveUntil || null,
      is_active: true,
    }

    if (existing) {
      const { data, error } = await supabase
        .schema('scheduling')
        .from('staff_schedules')
        .update({
          ...payload,
          updated_by_id: session.user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('id')
        .single<{ id: string }>()

      if (error) throw error
      revalidateSchedules()
      return { success: true, data: { id: data.id } }
    }

    const { data, error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .insert({
        ...payload,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })
      .select('id')
      .single<{ id: string }>()

    if (error) throw error
    revalidateSchedules()
    return { success: true, data: { id: data.id } }
  } catch (error) {
    console.error('Error upserting staff schedule:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save schedule',
    }
  }
}
