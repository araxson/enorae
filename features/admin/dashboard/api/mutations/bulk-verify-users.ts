'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { logSupabaseError } from '@/lib/supabase/errors'
import { enforceAdminBulkRateLimit } from '@/lib/middleware/rate-limit'
import { safeJsonParse } from '@/lib/utils/safe-json'

import type { ActionResponse } from '../../api/types'
import { BULK_USER_IDS_SCHEMA } from './validation'
import { logDashboardAudit } from './audit'
import { createOperationLogger } from '@/lib/observability'

export async function bulkVerifyUsers(
  formData: FormData,
): Promise<ActionResponse<{ verified: number; failed: number }>> {
  const logger = createOperationLogger('bulkVerifyUsers', {})
  logger.start()

  try {
    const userIds = formData.get('userIds')?.toString()
    if (!userIds) {
      return { success: false, error: 'User IDs required' }
    }

    const parsed = safeJsonParse<unknown>(userIds, null)
    if (parsed === null) {
      return { success: false, error: 'Invalid user IDs payload' }
    }

    const validation = BULK_USER_IDS_SCHEMA.safeParse(parsed)
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      const errorValues = Object.values(fieldErrors) as Array<string[] | undefined>
      const firstError = errorValues[0]?.[0]
      return {
        success: false,
        error: firstError ?? 'Invalid user IDs',
      }
    }
    const ids = validation.data

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()
    enforceAdminBulkRateLimit(session.user.id, 'dashboard:bulkVerifyUsers')

    // PERFORMANCE FIX: Parallelize auth updates instead of sequential loop
    // Auth API doesn't support batch operations, but parallel requests are much faster
    const results = await Promise.allSettled(
      ids.map(userId =>
        supabase.auth.admin.updateUserById(userId, {
          email_confirm: true,
        })
      )
    )

    let verified = 0
    let failed = 0

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && !result.value.error) {
        verified++
      } else {
        failed++
        const error = result.status === 'fulfilled' ? result.value.error : result.reason
        logSupabaseError(`bulkVerifyUsers:${ids[index]}`, error)
      }
    })

    await logDashboardAudit(supabase, session.user.id, 'bulk_users_email_verified', 'info', {
      total_requested: ids.length,
      verified,
      failed,
    })

    revalidatePath('/admin', 'layout')
    revalidatePath('/admin/users', 'page')
    return { success: true, data: { verified, failed } }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify users',
    }
  }
}
