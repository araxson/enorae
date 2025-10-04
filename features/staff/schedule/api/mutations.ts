'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Note: While staff_schedules has a public view for SELECT queries,
// INSERT/UPDATE/DELETE operations still need .schema() to access the underlying table

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const scheduleSchema = z.object({
  staff_id: z.string().uuid(),
  day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  break_start: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
  break_end: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
  is_active: z.boolean().default(true),
})

type ActionResult = {
  success?: boolean
  error?: string
  data?: unknown
}

/**
 * Create a new staff schedule
 */
export async function createStaffSchedule(
  salonId: string,
  data: z.infer<typeof scheduleSchema>
): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const validated = scheduleSchema.parse(data)
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Check for existing schedule for this day
    const { data: existingSchedule } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .select('id')
      .eq('staff_id', validated.staff_id)
      .eq('salon_id', salonId)
      .eq('day_of_week', validated.day_of_week)
      .eq('is_active', true)
      .single()

    if (existingSchedule) {
      return { error: 'Schedule conflict: Staff member already has a schedule for this day' }
    }

    // Create schedule
    const { data: schedule, error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .insert({
        salon_id: salonId,
        staff_id: validated.staff_id,
        day_of_week: validated.day_of_week,
        start_time: validated.start_time,
        end_time: validated.end_time,
        break_start: validated.break_start || null,
        break_end: validated.break_end || null,
        is_active: validated.is_active,
        created_by_id: user.id,
        updated_by_id: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/business/staff/schedules')
    return { success: true, data: schedule }
  } catch (error) {
    console.error('Error creating schedule:', error)
    return { error: error instanceof Error ? error.message : 'Failed to create schedule' }
  }
}

/**
 * Update a staff schedule
 */
export async function updateStaffSchedule(
  scheduleId: string,
  data: Partial<z.infer<typeof scheduleSchema>>
): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(scheduleId)) {
      return { error: 'Invalid schedule ID format' }
    }

    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Get existing schedule to verify ownership
    const { data: schedule } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .select('salon_id, staff_id, day_of_week, start_time, end_time')
      .eq('id', scheduleId)
      .single()

    if (!schedule) return { error: 'Schedule not found' }

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', schedule.salon_id)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // If time or day is being updated, check for conflicts
    if (data.start_time || data.end_time || data.day_of_week) {
      const { data: conflicting } = await supabase
        .schema('scheduling')
        .from('staff_schedules')
        .select('id')
        .eq('staff_id', data.staff_id || schedule.staff_id)
        .eq('salon_id', schedule.salon_id)
        .eq('day_of_week', data.day_of_week || schedule.day_of_week)
        .eq('is_active', true)
        .neq('id', scheduleId)
        .single()

      if (conflicting) {
        return { error: 'Schedule conflict: Staff member already has a schedule for this day' }
      }
    }

    // Update schedule
    const { data: updated, error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .update({
        ...data,
        updated_by_id: user.id,
      })
      .eq('id', scheduleId)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/business/staff/schedules')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating schedule:', error)
    return { error: error instanceof Error ? error.message : 'Failed to update schedule' }
  }
}

/**
 * Delete a staff schedule
 */
export async function deleteStaffSchedule(scheduleId: string): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(scheduleId)) {
      return { error: 'Invalid schedule ID format' }
    }

    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Get existing schedule to verify ownership
    const { data: schedule } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .select('salon_id')
      .eq('id', scheduleId)
      .single()

    if (!schedule) return { error: 'Schedule not found' }

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', schedule.salon_id)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Delete schedule
    const { error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .delete()
      .eq('id', scheduleId)

    if (error) throw error

    revalidatePath('/business/staff/schedules')
    return { success: true }
  } catch (error) {
    console.error('Error deleting schedule:', error)
    return { error: error instanceof Error ? error.message : 'Failed to delete schedule' }
  }
}

/**
 * Bulk create schedules for a staff member (weekly template)
 */
export async function bulkCreateSchedules(
  salonId: string,
  staffId: string,
  schedules: Array<{
    day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
    start_time: string
    end_time: string
    break_start?: string
    break_end?: string
    is_active: boolean
  }>
): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(salonId) || !UUID_REGEX.test(staffId)) {
      return { error: 'Invalid ID format' }
    }

    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Check for existing schedules for these days
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

    // Bulk insert
    const { data: created, error } = await supabase
      .schema('scheduling')
      .from('staff_schedules')
      .insert(
        schedules.map(s => ({
          salon_id: salonId,
          staff_id: staffId,
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
          break_start: s.break_start || null,
          break_end: s.break_end || null,
          is_active: s.is_active,
          created_by_id: user.id,
          updated_by_id: user.id,
        }))
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
