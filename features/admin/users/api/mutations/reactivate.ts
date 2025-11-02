import 'server-only'

import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { sanitizeAdminText } from '@/features/admin/admin-common/api/text-sanitizers'
import type { Json } from '@/lib/types/database.types'
import { reactivateUserSchema, UUID_REGEX } from '../../constants'
import { createOperationLogger, logError } from '@/lib/observability'

export async function reactivateUser(formData: FormData) {
  const logger = createOperationLogger('reactivateUser', {})
  logger.start()

  try {
    const parsed = reactivateUserSchema.safeParse({
      userId: formData.get('userId')?.toString(),
      note: formData.get('note')?.toString(),
    })

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? 'Invalid reactivation payload' }
    }

    const { userId, note } = parsed.data

    if (!UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    const sanitizedNote = note ? sanitizeAdminText(note) : null

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
    const { error: rolesError } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: true,
        updated_by_id: session.user.id,
      })
      .eq('user_id', userId)

    if (rolesError) return { error: rolesError.message }

    // Audit logging
    const metadata: Json = {
      note: sanitizedNote ?? 'No note provided',
      reactivated_by: session.user.id,
    }

    const { error: auditError } = await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'user_reactivated',
      event_category: 'identity',
      severity: 'info',
      user_id: session.user.id,
      action: 'reactivate_user',
      entity_type: 'user',
      entity_id: userId,
      target_schema: 'identity',
      target_table: 'profiles',
      target_id: userId,
      metadata,
      is_success: true,
    })

    if (auditError) {
      logger.error(auditError, 'system')
    }

    revalidatePath('/admin/users', 'page')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to reactivate user',
    }
  }
}
