import 'server-only'

import { revalidatePath } from 'next/cache'
import { resolveClient, resolveSessionRoles, ensureSalonAccess, BLOCKED_TIMES_PATHS, UUID_REGEX } from './shared'

export async function deleteBlockedTime(id: string) {
  try {
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid blocked time ID' }
    }

    const supabase = await resolveClient()
    await resolveSessionRoles()

    const { data: existingBlockedTime, error: fetchError } = await supabase
      .from('blocked_times')
      .select('salon_id')
      .eq('id', id)
      .single<{ salon_id: string | null }>()

    if (fetchError || !existingBlockedTime?.salon_id) {
      return { error: 'Blocked time not found' }
    }

    await ensureSalonAccess(existingBlockedTime.salon_id)

    const { error } = await supabase
      .schema('scheduling')
      .from('blocked_times')
      .delete()
      .eq('id', id)
      .eq('salon_id', existingBlockedTime.salon_id)

    if (error) {
      return { error: error.message }
    }

    BLOCKED_TIMES_PATHS.forEach((path) => revalidatePath(path))

    return { success: true, error: null }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message }
    }
    return { error: error instanceof Error ? error.message : 'Failed to delete blocked time' }
  }
}
