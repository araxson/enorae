'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { logSupabaseError } from '@/lib/supabase/errors'
import { enforceAdminBulkRateLimit } from '@/lib/middleware/rate-limit'

import { logDashboardAudit } from './audit'
import type { ActionResponse } from './types'
import { BULK_USER_IDS_SCHEMA } from './validation'

export async function bulkVerifyUsers(
  formData: FormData,
): Promise<ActionResponse<{ verified: number; failed: number }>> {
  try {
    const userIds = formData.get('userIds')?.toString()
    if (!userIds) {
      return { success: false, error: 'User IDs required' }
    }

    let ids: string[]
    try {
      const parsed = JSON.parse(userIds)
      const validation = BULK_USER_IDS_SCHEMA.safeParse(parsed)
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.issues[0]?.message ?? 'Invalid user IDs',
        }
      }
      ids = validation.data
    } catch {
      return { success: false, error: 'Invalid user IDs payload' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()
    enforceAdminBulkRateLimit(session.user.id, 'dashboard:bulkVerifyUsers')

    let verified = 0
    let failed = 0

    for (const userId of ids) {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        email_confirm: true,
      })

      if (error) {
        failed++
        logSupabaseError(`bulkVerifyUsers:${userId}`, error)
      } else {
        verified++
      }
    }

    await logDashboardAudit(supabase, session.user.id, 'bulk_users_email_verified', 'info', {
      total_requested: ids.length,
      verified,
      failed,
    })

    revalidatePath('/admin', 'layout')
    revalidatePath('/admin/users', 'page')
    return { success: true, data: { verified, failed } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify users',
    }
  }
}
