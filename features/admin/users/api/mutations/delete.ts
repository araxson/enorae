import 'server-only'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole } from '@/lib/auth'
import { sanitizeAdminText } from '@/features/admin/admin-common'

import { UUID_REGEX } from './constants'

export async function deleteUserPermanently(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString()
    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    const reason = sanitizeAdminText(formData.get('reason')?.toString(), 'No reason provided')

    const session = await requireAnyRole(['super_admin'])
    const supabase = createServiceRoleClient()

    const { data: userData, error: fetchError } = await supabase
      .schema('identity')
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .maybeSingle()

    if (fetchError) {
      return { error: fetchError.message }
    }

    const { error } = await supabase
      .schema('identity')
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) return { error: error.message }

    const { error: auditError } = await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'user_permanently_deleted',
      event_category: 'security',
      severity: 'critical',
      user_id: session.user.id,
      action: 'delete_user_permanently',
      entity_type: 'user',
      entity_id: userId,
      target_schema: 'identity',
      target_table: 'profiles',
      metadata: {
        deleted_user_username: userData?.username ?? null,
        deleted_by: session.user.id,
        reason,
      },
      is_success: true,
    })

    if (auditError) {
      console.error('[Users] Failed to record audit log for permanent deletion', auditError)
    }

    revalidatePath('/admin/users', 'page')
    return { success: true, message: 'User deleted permanently' }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete user',
    }
  }
}
