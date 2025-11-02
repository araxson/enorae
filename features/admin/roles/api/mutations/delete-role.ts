'use server'

import { revalidatePath } from 'next/cache'

import { logRoleAudit } from './audit'
import { requireSuperAdminContext } from './context'
import { UUID_REGEX } from './validation'
import type { RoleActionResponse } from '../../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function deleteRole(formData: FormData): Promise<RoleActionResponse> {
  const logger = createOperationLogger('deleteRole', {})

  try {
    const roleId = formData.get('roleId')?.toString()
    if (!roleId || !UUID_REGEX.test(roleId)) {
      logger.error('Invalid role ID format', 'validation')
      return { success: false, error: 'Invalid role ID' }
    }

    const { session, supabase } = await requireSuperAdminContext()

    logger.start({ roleId, superAdminId: session.user.id })

    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .delete()
      .eq('id', roleId)

    if (error) {
      logger.error(error, 'database', { roleId, superAdminId: session.user.id })
      return { success: false, error: error.message }
    }

    await logRoleAudit(supabase, session.user.id, 'role_deleted', 'critical', {
      role_id: roleId,
      deleted_by: session.user.id,
    })

    logMutation('delete', 'role', roleId, {
      superAdminId: session.user.id,
      operationName: 'deleteRole',
    })

    logger.success({ roleId, superAdminId: session.user.id })
    revalidatePath('/admin/roles', 'page')
    revalidatePath('/admin/users', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete role',
    }
  }
}
