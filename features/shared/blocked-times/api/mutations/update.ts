'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { resolveClient, resolveSessionRoles, ensureSalonAccess, BLOCKED_TIMES_PATHS, UUID_REGEX } from './shared'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

const updateSchema = z.object({
  staff_id: z.string().regex(UUID_REGEX).optional(),
  block_type: z.enum(['maintenance', 'other', 'break', 'vacation', 'sick_leave', 'training', 'personal', 'lunch', 'holiday']).optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  reason: z.string().min(1).optional(),
  is_recurring: z.boolean().optional(),
  recurrence_pattern: z.string().optional(),
})

export async function updateBlockedTime(id: string, input: Partial<z.infer<typeof updateSchema>>) {
  const logger = createOperationLogger('updateBlockedTime', {})
  logger.start()

  try {
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid blocked time ID' }
    }

    const supabase = await resolveClient()
    const session = await resolveSessionRoles()

    const { data: existingBlockedTime, error: fetchError } = await supabase
      .schema('scheduling').from('blocked_times')
      .select('salon_id')
      .eq('id', id)
      .single<{ salon_id: string | null }>()

    if (fetchError || !existingBlockedTime?.salon_id) {
      return { error: 'Blocked time not found' }
    }

    await ensureSalonAccess(existingBlockedTime.salon_id)

    const parsed = updateSchema.safeParse(input)
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? 'Invalid block data' }
    }

    if (parsed.data.start_time && parsed.data.end_time) {
      if (new Date(parsed.data.end_time) <= new Date(parsed.data.start_time)) {
        return { error: 'End time must be after start time' }
      }
    }

    const { data, error } = await supabase
      .schema('scheduling')
      .schema('scheduling').from('blocked_times')
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', existingBlockedTime.salon_id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    BLOCKED_TIMES_PATHS.forEach((path) => revalidatePath(path, 'page'))

    return { data, error: null }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message }
    }
    return { error: 'Failed to update blocked time' }
  }
}
