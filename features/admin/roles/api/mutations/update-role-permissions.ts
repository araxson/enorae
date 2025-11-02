'use server'

import { revalidatePath } from 'next/cache'

import { logRoleAudit } from './audit'
import { requireAdminContext } from './context'
import { parsePermissions } from './assignment-helpers'
import { UUID_REGEX } from './validation'
import type { RoleActionResponse } from '../../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function updateRolePermissions(formData: FormData): Promise<RoleActionResponse> {
  const logger = createOperationLogger('updateRolePermissions', {})
  logger.start()

  try {
    const roleId = formData.get('roleId')?.toString()
    if (!roleId || !UUID_REGEX.test(roleId)) {
      return { success: false, error: 'Invalid role ID' }
    }

    const permissions = parsePermissions(formData.get('permissions')) || []

    const { session, supabase } = await requireAdminContext()

    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({ permissions, updated_by_id: session.user.id })
      .eq('id', roleId)

    if (error) {
      return { success: false, error: error.message }
    }

    await logRoleAudit(supabase, session.user.id, 'role_permissions_updated', 'info', {
      role_id: roleId,
      permissions,
    })

    revalidatePath('/admin/roles', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update permissions',
    }
  }
}
