'use server'

import { revalidatePath } from 'next/cache'

import { logRoleAudit } from './audit'
import { applyRoleAssignment } from './assignments'
import { parsePermissions } from './assignment-helpers'
import { requireAdminContext } from './context'
import type { AssignmentPayload } from './assignments'
import { assignmentSchema, ROLES_NEEDING_SALON } from './validation'
import type { RoleActionResponse } from './types'

export async function assignRole(formData: FormData): Promise<RoleActionResponse> {
  try {
    const { session, supabase } = await requireAdminContext()
    const actorId = session.user.id

    const payload: AssignmentPayload = {
      userId: formData.get('userId')?.toString() ?? '',
      role: formData.get('role')?.toString() as AssignmentPayload['role'],
      salonId: formData.get('salonId')?.toString() || undefined,
      permissions: parsePermissions(formData.get('permissions')),
    }

    const validation = assignmentSchema.safeParse(payload)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message ?? 'Invalid payload' }
    }

    if (ROLES_NEEDING_SALON.includes(payload.role) && !payload.salonId) {
      return { success: false, error: 'Salon ID required for this role' }
    }

    const appliedRoleId = await applyRoleAssignment(supabase, payload, actorId)

    await logRoleAudit(supabase, actorId, 'role_assigned', 'info', {
      target_user_id: payload.userId,
      role: payload.role,
      salon_id: payload.salonId ?? null,
      role_id: appliedRoleId,
    })

    revalidatePath('/admin/users')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign role',
    }
  }
}
