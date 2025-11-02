'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { logSupabaseError } from '@/lib/supabase/errors'

import { logDashboardAudit } from './audit'
import type { ActionResponse } from '../../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function verifyUserEmail(formData: FormData): Promise<ActionResponse> {
  const logger = createOperationLogger('verifyUserEmail', {})
  logger.start()

  try {
    const userId = formData.get('userId')?.toString()
    if (!userId) {
      return { success: false, error: 'User ID required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true,
    })

    if (error) {
      logSupabaseError('verifyUserEmail', error)
      return { success: false, error: error.message }
    }

    await logDashboardAudit(supabase, session.user.id, 'user_email_verified_admin', 'info', {
      target_user_id: userId,
    })

    revalidatePath('/admin', 'layout')
    revalidatePath('/admin/users', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify email',
    }
  }
}
