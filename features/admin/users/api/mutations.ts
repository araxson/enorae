'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'


// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  fullName: z.string().min(1).max(200).optional(),
})

const suspendUserSchema = z.object({
  userId: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  reason: z.string().optional(),
})

/**
 * Update user profile
 * SECURITY: Platform admin only
 */
export async function updateUserProfile(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString()
    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    const result = updateProfileSchema.safeParse({
      username: formData.get('username')?.toString(),
      fullName: formData.get('fullName')?.toString(),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const data = result.data

    // Update profile
    if (data.username !== undefined) {
      const { error: profileError } = await supabase
        .schema('identity')
        .from('profiles')
        .update({
          username: data.username,
          updated_by_id: session.user.id,
        })
        .eq('id', userId)

      if (profileError) return { error: profileError.message }
    }

    // Update metadata
    if (data.fullName !== undefined) {
      const { error: metadataError } = await supabase
        .schema('identity')
        .from('profiles_metadata')
        .update({
          full_name: data.fullName,
        })
        .eq('profile_id', userId)

      if (metadataError) return { error: metadataError.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}

/**
 * Suspend user account (soft delete)
 * SECURITY: Platform admin only
 */
export async function suspendUser(formData: FormData) {
  try {
    const result = suspendUserSchema.safeParse({
      userId: formData.get('userId')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { userId } = result.data

    // Soft delete profile
    const { error: profileError } = await supabase
      .schema('identity')
      .from('profiles')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', userId)

    if (profileError) return { error: profileError.message }

    // Deactivate all user roles
    const { error: rolesError } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: false,
        updated_by_id: session.user.id,
      })
      .eq('user_id', userId)

    if (rolesError) return { error: rolesError.message }

    // Deactivate all sessions
    const { error: sessionsError } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('user_id', userId)

    if (sessionsError) return { error: sessionsError.message }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to suspend user',
    }
  }
}

/**
 * Reactivate suspended user
 * SECURITY: Platform admin only
 */
export async function reactivateUser(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString()
    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    // Restore profile
    const { error: profileError } = await supabase
      .schema('identity')
      .from('profiles')
      .update({
        deleted_at: null,
        updated_by_id: session.user.id,
      })
      .eq('id', userId)

    if (profileError) return { error: profileError.message }

    // Note: Roles stay inactive until manually reactivated
    // Sessions stay terminated (user must login again)

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to reactivate user',
    }
  }
}

/**
 * Terminate specific user session
 * SECURITY: Platform admin only
 */
export async function terminateSession(formData: FormData) {
  try {
    const sessionId = formData.get('sessionId')?.toString()
    if (!sessionId || !UUID_REGEX.test(sessionId)) {
      return { error: 'Invalid session ID' }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { error } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', sessionId)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to terminate session',
    }
  }
}

/**
 * Terminate all user sessions
 * SECURITY: Platform admin only
 */
export async function terminateAllUserSessions(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString()
    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { error } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Failed to terminate sessions',
    }
  }
}

/**
 * Permanently delete user (hard delete)
 * SECURITY: Super admin only
 * WARNING: This is irreversible
 */
export async function deleteUserPermanently(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString()
    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    // SECURITY: Require SUPER_ADMIN (not just platform_admin)
    await requireAnyRole(['super_admin'])
    const supabase = await createClient()

    // Hard delete (CASCADE will handle related records)
    // Note: Only use this for GDPR/compliance requests
    const { error } = await supabase
      .schema('identity')
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete user',
    }
  }
}
