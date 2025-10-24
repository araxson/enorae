import 'server-only'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import { UUID_REGEX } from './constants'

export async function terminateSession(formData: FormData) {
  try {
    const sessionId = formData.get('sessionId')?.toString()
    if (!sessionId || !UUID_REGEX.test(sessionId)) {
      return { error: 'Invalid session ID' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', sessionId)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to terminate session',
    }
  }
}

export async function terminateAllUserSessions(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString()
    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to terminate sessions',
    }
  }
}
