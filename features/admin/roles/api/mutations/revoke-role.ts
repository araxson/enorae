'use server'

import { revalidatePath } from 'next/cache'

import { logRoleAudit } from './audit'
import { requireAdminContext } from './context'
import { UUID_REGEX } from './validation'
import type { RoleActionResponse } from '../../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function revokeRole(formData: FormData): Promise<RoleActionResponse> {
  const logger = createOperationLogger('revokeRole', {})

  try {
    const roleId = formData.get('roleId')?.toString()
    if (!roleId || !UUID_REGEX.test(roleId)) {
      logger.error('Invalid role ID format', 'validation')
      return { success: false, error: 'Invalid role ID' }
    }

    const { session, supabase } = await requireAdminContext()

    logger.start({ roleId, adminId: session.user.id })

    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: false,
        updated_by_id: session.user.id,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', roleId)

    if (error) {
      logger.error(error, 'database', { roleId, adminId: session.user.id })
      return { success: false, error: error.message }
    }

    await logRoleAudit(supabase, session.user.id, 'role_revoked', 'warning', {
      role_id: roleId,
      revoked_by: session.user.id,
    })

    logMutation('revoke', 'role', roleId, {
      adminId: session.user.id,
      operationName: 'revokeRole',
    })

    logger.success({ roleId, adminId: session.user.id })
    revalidatePath('/admin/roles', 'page')
    revalidatePath('/admin/users', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to revoke role',
    }
  }
}
