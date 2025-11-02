'use server'

import { revalidatePath } from 'next/cache'

import { logRoleAudit } from './audit'
import { applyRoleAssignment } from './assignments'
import { parsePermissions } from './assignment-helpers'
import { requireAdminContext } from './context'
import type { AssignmentPayload } from './assignments'
import { assignmentSchema, ROLES_NEEDING_SALON } from './validation'
import type { RoleActionResponse } from '../../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function assignRole(formData: FormData): Promise<RoleActionResponse> {
  const logger = createOperationLogger('assignRole', {})

  try {
    const { session, supabase } = await requireAdminContext()
    const actorId = session.user.id

    const payload: AssignmentPayload = {
      userId: formData.get('userId')?.toString() ?? '',
      role: formData.get('role')?.toString() as AssignmentPayload['role'],
      salonId: formData.get('salonId')?.toString() || undefined,
      permissions: parsePermissions(formData.get('permissions')),
    }

    logger.start({ targetUserId: payload.userId, role: payload.role, salonId: payload.salonId, adminId: actorId })

    const validation = assignmentSchema.safeParse(payload)
    if (!validation.success) {
      logger.error(validation.error.issues[0]?.message ?? 'Invalid payload', 'validation', { targetUserId: payload.userId, adminId: actorId })
      return { success: false, error: validation.error.issues[0]?.message ?? 'Invalid payload' }
    }

    if (ROLES_NEEDING_SALON.includes(payload.role) && !payload.salonId) {
      logger.error('Salon ID required for role', 'validation', { targetUserId: payload.userId, role: payload.role, adminId: actorId })
      return { success: false, error: 'Salon ID required for this role' }
    }

    const appliedRoleId = await applyRoleAssignment(supabase, payload, actorId)

    await logRoleAudit(supabase, actorId, 'role_assigned', 'info', {
      target_user_id: payload.userId,
      role: payload.role,
      salon_id: payload.salonId ?? null,
      role_id: appliedRoleId,
    })

    logMutation('assign', 'role', appliedRoleId, {
      targetUserId: payload.userId,
      adminId: actorId,
      salonId: payload.salonId,
      operationName: 'assignRole',
      changes: { role: payload.role, permissions: payload.permissions },
    })

    logger.success({ targetUserId: payload.userId, role: payload.role, roleId: appliedRoleId, adminId: actorId })
    revalidatePath('/admin/users', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign role',
    }
  }
}
