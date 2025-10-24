import 'server-only'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import { suspendUserSchema, UUID_REGEX } from './constants'

export async function suspendUser(formData: FormData) {
  try {
    const result = suspendUserSchema.safeParse({
      userId: formData.get('userId')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    if (!result.success) {
      return { error: result.error.errors[0]?.message ?? 'Invalid form data' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()
    const { userId, reason } = result.data
    const duration = formData.get('duration')?.toString()

    const { error: profileError } = await supabase
      .schema('identity')
      .from('profiles')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', userId)

    if (profileError) return { error: profileError.message }

    const { error: rolesError } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: false,
        updated_by_id: session.user.id,
      })
      .eq('user_id', userId)

    if (rolesError) return { error: rolesError.message }

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

    // Enhanced audit logging
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'user_suspended',
      event_category: 'identity',
      severity: 'warning',
      user_id: session.user.id,
      action: 'suspend_user',
      entity_type: 'user',
      entity_id: userId,
      target_schema: 'identity',
      target_table: 'profiles',
      metadata: {
        reason: reason || 'No reason provided',
        duration_days: duration ? parseInt(duration, 10) : null,
        suspended_by: session.user.id,
      },
      is_success: true,
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to suspend user',
    }
  }
}

export async function reactivateUser(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString()
    const note = formData.get('note')?.toString()

    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error: profileError } = await supabase
      .schema('identity')
      .from('profiles')
      .update({
        deleted_at: null,
        updated_by_id: session.user.id,
      })
      .eq('id', userId)

    if (profileError) return { error: profileError.message }

    // Reactivate roles
    await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: true,
        updated_by_id: session.user.id,
      })
      .eq('user_id', userId)

    // Audit logging
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'user_reactivated',
      event_category: 'identity',
      severity: 'info',
      user_id: session.user.id,
      action: 'reactivate_user',
      entity_type: 'user',
      entity_id: userId,
      target_schema: 'identity',
      target_table: 'profiles',
      metadata: {
        note: note || 'No note provided',
        reactivated_by: session.user.id,
      },
      is_success: true,
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to reactivate user',
    }
  }
}

/**
 * Ban user permanently - requires super_admin role
 * Terminates all sessions and marks user as permanently banned
 */
export async function banUser(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString()
    const reason = formData.get('reason')?.toString()
    const permanent = formData.get('permanent')?.toString() !== 'false'

    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    if (!reason) {
      return { error: 'Ban reason is required' }
    }

    const session = await requireAnyRole(['super_admin'])
    const supabase = createServiceRoleClient()

    // Mark profile as deleted (banned)
    const { error: profileError } = await supabase
      .schema('identity')
      .from('profiles')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', userId)

    if (profileError) return { error: profileError.message }

    // Deactivate all roles
    await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: false,
        updated_by_id: session.user.id,
      })
      .eq('user_id', userId)

    // Terminate all sessions
    await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('user_id', userId)

    // Critical audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'user_banned',
      event_category: 'security',
      severity: 'critical',
      user_id: session.user.id,
      action: 'ban_user',
      entity_type: 'user',
      entity_id: userId,
      target_schema: 'identity',
      target_table: 'profiles',
      metadata: {
        reason,
        is_permanent: permanent,
        banned_by: session.user.id,
      },
      is_success: true,
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to ban user',
    }
  }
}

/**
 * Batch update user status - for bulk operations
 */
export async function batchUpdateUserStatus(formData: FormData) {
  try {
    const userIdsString = formData.get('userIds')?.toString()
    const action = formData.get('action')?.toString()
    const reason = formData.get('reason')?.toString()

    if (!userIdsString || !action) {
      return { error: 'User IDs and action are required' }
    }

    const userIds = userIdsString.split(',').filter((id) => UUID_REGEX.test(id))

    if (userIds.length === 0) {
      return { error: 'No valid user IDs provided' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const timestamp = new Date().toISOString()

    if (action === 'suspend') {
      // Suspend multiple users
      await supabase
        .schema('identity')
        .from('profiles')
        .update({
          deleted_at: timestamp,
          deleted_by_id: session.user.id,
        })
        .in('id', userIds)

      await supabase
        .schema('identity')
        .from('user_roles')
        .update({
          is_active: false,
          updated_by_id: session.user.id,
        })
        .in('user_id', userIds)

      await supabase
        .schema('identity')
        .from('sessions')
        .update({
          is_active: false,
          deleted_at: timestamp,
          deleted_by_id: session.user.id,
        })
        .in('user_id', userIds)
    } else if (action === 'reactivate') {
      // Reactivate multiple users
      await supabase
        .schema('identity')
        .from('profiles')
        .update({
          deleted_at: null,
          updated_by_id: session.user.id,
        })
        .in('id', userIds)

      await supabase
        .schema('identity')
        .from('user_roles')
        .update({
          is_active: true,
          updated_by_id: session.user.id,
        })
        .in('user_id', userIds)
    }

    // Batch audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'batch_user_status_update',
      event_category: 'identity',
      severity: 'warning',
      user_id: session.user.id,
      action: `batch_${action}_users`,
      target_schema: 'identity',
      target_table: 'profiles',
      metadata: {
        user_ids: userIds,
        action,
        reason: reason || 'No reason provided',
        count: userIds.length,
        updated_by: session.user.id,
      },
      is_success: true,
    })

    revalidatePath('/admin/users')
    return { success: true, count: userIds.length }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update user status',
    }
  }
}
