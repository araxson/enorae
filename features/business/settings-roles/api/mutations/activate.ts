'use server'

import { revalidatePath } from 'next/cache'
import { getAuthorizedContext, verifyRoleAccess, UUID_REGEX, type ActionResult } from './helpers'

/**
 * Deactivate user role (soft delete)
 */
export async function deactivateUserRole(id: string): Promise<ActionResult> {
  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid role ID' }
    }

    const { session, accessibleSalonIds, supabase } = await getAuthorizedContext()

    // Verify role belongs to accessible salon
    await verifyRoleAccess(supabase, id, accessibleSalonIds)

    // Deactivate role (soft delete)
    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/settings/roles', 'page')

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to deactivate user role' }
  }
}

/**
 * Reactivate user role
 */
export async function reactivateUserRole(id: string): Promise<ActionResult> {
  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid role ID' }
    }

    const { session, accessibleSalonIds, supabase } = await getAuthorizedContext()

    // Verify role belongs to accessible salon
    await verifyRoleAccess(supabase, id, accessibleSalonIds)

    // Reactivate role
    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: true,
        deleted_at: null,
        updated_by_id: session.user.id,
      })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/settings/roles', 'page')

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to reactivate user role' }
  }
}
