'use server'

import { revalidatePath } from 'next/cache'

import { enforceAdminBulkRateLimit } from '@/lib/rate-limit/admin-bulk'

import { logRoleAudit } from './audit'
import { applyRoleAssignment } from './assignments'
import { requireAdminContext } from './context'
import { bulkSchema, ROLES_NEEDING_SALON } from './validation'
import type { RoleActionResponse } from './types'

export async function bulkAssignRoles(
  formData: FormData,
): Promise<RoleActionResponse<{ success: number; failed: number; errors: string[] }>> {
  try {
    const payloadRaw = formData.get('payload')?.toString()
    if (!payloadRaw) {
      return { success: false, error: 'Missing bulk payload' }
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(payloadRaw)
    } catch (error) {
      return { success: false, error: 'Invalid bulk payload JSON' }
    }

    const validation = bulkSchema.safeParse(parsed)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || 'Invalid bulk payload',
      }
    }

    const { session, supabase } = await requireAdminContext()
    enforceAdminBulkRateLimit(session.user.id, 'roles:bulkAssign')

    const results = { success: 0, failed: 0, errors: [] as string[] }

    for (const assignment of validation.data) {
      if (ROLES_NEEDING_SALON.includes(assignment.role) && !assignment.salonId) {
        results.failed += 1
        results.errors.push(
          `Role ${assignment.role} requires a salon for user ${assignment.userId}`,
        )
        continue
      }

      try {
        await applyRoleAssignment(supabase, assignment, session.user.id)
        results.success += 1
      } catch (error) {
        results.failed += 1
        results.errors.push(
          error instanceof Error
            ? `${assignment.userId}: ${error.message}`
            : `${assignment.userId}: unable to assign role`,
        )
      }
    }

    await logRoleAudit(supabase, session.user.id, 'role_bulk_assignment', 'warning', {
      total_processed: validation.data.length,
      succeeded: results.success,
      failed: results.failed,
      errors: results.errors,
    })

    revalidatePath('/admin/roles')
    revalidatePath('/admin/users')

    return { success: true, data: results }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process bulk assignment',
    }
  }
}
