'use server'

import { revalidatePath } from 'next/cache'

import { logRoleAudit } from './audit'
import { requireAdminContext } from './context'
import { UUID_REGEX } from './validation'
import type { RoleActionResponse } from './types'

export async function revokeRole(formData: FormData): Promise<RoleActionResponse> {
  try {
    const roleId = formData.get('roleId')?.toString()
    if (!roleId || !UUID_REGEX.test(roleId)) {
      return { success: false, error: 'Invalid role ID' }
    }

    const { session, supabase } = await requireAdminContext()

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
      return { success: false, error: error.message }
    }

    await logRoleAudit(supabase, session.user.id, 'role_revoked', 'warning', {
      role_id: roleId,
      revoked_by: session.user.id,
    })

    revalidatePath('/admin/roles')
    revalidatePath('/admin/users')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to revoke role',
    }
  }
}
