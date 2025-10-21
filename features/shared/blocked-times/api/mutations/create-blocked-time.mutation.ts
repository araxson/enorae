'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { resolveClient, resolveSessionRoles, ensureSalonAccess, BLOCKED_TIMES_PATHS, UUID_REGEX } from './shared'

const blockedTimeSchema = z.object({
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID').optional(),
  block_type: z.enum(['maintenance', 'other', 'break', 'vacation', 'sick_leave', 'training', 'personal', 'lunch', 'holiday']),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  reason: z.string().min(1, 'Reason is required').optional(),
  is_recurring: z.boolean().optional(),
  recurrence_pattern: z.string().optional(),
})

export async function createBlockedTime(input: z.infer<typeof blockedTimeSchema>) {
  try {
    const validated = blockedTimeSchema.parse(input)
    const supabase = await resolveClient()
    const session = await resolveSessionRoles()

    await ensureSalonAccess(validated.salon_id)

    if (new Date(validated.end_time) <= new Date(validated.start_time)) {
      return { error: 'End time must be after start time' }
    }

    const { data, error } = await supabase
      .schema('scheduling')
      .from('blocked_times')
      .insert({
        salon_id: validated.salon_id,
        staff_id: validated.staff_id || null,
        block_type: validated.block_type,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
        start_time: validated.start_time,
        end_time: validated.end_time,
        reason: validated.reason || null,
        is_recurring: validated.is_recurring || false,
        recurrence_pattern: validated.recurrence_pattern || null,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    BLOCKED_TIMES_PATHS.forEach((path) => revalidatePath(path))

    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message }
    }
    return { error: 'Failed to create blocked time' }
  }
}
