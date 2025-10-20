'use server'

import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Json } from '@/lib/types/database.types'
import { UUID_REGEX } from './constants'

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
    const metadata: Json = {
      user_ids: userIds,
      action,
      reason: reason || 'No reason provided',
      count: userIds.length,
      updated_by: session.user.id,
    }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'batch_user_status_update',
      event_category: 'identity',
      severity: 'warning',
      user_id: session.user.id,
      action: `batch_${action}_users`,
      target_schema: 'identity',
      target_table: 'profiles',
      target_id: null,
      metadata,
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
