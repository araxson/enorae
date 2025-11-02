'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'
import {
  getAuthorizedContext,
  verifyRoleAccess,
  parsePermissions,
  UUID_REGEX,
  VALID_ROLES,
  type ActionResult,
} from './helpers'

/**
 * Update user role
 */
export async function updateUserRole(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const logger = createOperationLogger('updateUserRole', {})
  logger.start()

  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid role ID' }
    }

    const { session, accessibleSalonIds, supabase } = await getAuthorizedContext()

    // Verify role belongs to accessible salon
    await verifyRoleAccess(supabase, id, accessibleSalonIds)

    // Parse input
    const role = formData.get('role') as string
    const permissions = parsePermissions(formData.get('permissions'))

    // Update role
    const { data, error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        role: role as typeof VALID_ROLES[number],
        permissions: permissions || [],
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/settings/roles', 'page')

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || 'Validation failed' }
    }
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to update user role' }
  }
}
