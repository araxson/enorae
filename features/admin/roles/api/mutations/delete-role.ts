'use server'

import { revalidatePath } from 'next/cache'

import { logRoleAudit } from './audit'
import { requireSuperAdminContext } from './context'
import { UUID_REGEX } from './validation'
import type { RoleActionResponse } from './types'

export async function deleteRole(formData: FormData): Promise<RoleActionResponse> {
  try {
    const roleId = formData.get('roleId')?.toString()
    if (!roleId || !UUID_REGEX.test(roleId)) {
      return { success: false, error: 'Invalid role ID' }
    }

    const { session, supabase } = await requireSuperAdminContext()

    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .delete()
      .eq('id', roleId)

    if (error) {
      return { success: false, error: error.message }
    }

    await logRoleAudit(supabase, session.user.id, 'role_deleted', 'critical', {
      role_id: roleId,
      deleted_by: session.user.id,
    })

    revalidatePath('/admin/roles', 'page')
    revalidatePath('/admin/users', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete role',
    }
  }
}
