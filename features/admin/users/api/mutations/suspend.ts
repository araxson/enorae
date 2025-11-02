import 'server-only'

import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { sanitizeAdminText } from '@/features/admin/admin-common/api/text-sanitizers'
import type { Json } from '@/lib/types/database.types'
import { suspendUserSchema, UUID_REGEX } from '../../constants'
import { createOperationLogger, logError } from '@/lib/observability/logger'

export async function suspendUser(formData: FormData) {
  const logger = createOperationLogger('suspendUser', {})
  logger.start()

  try {
    const parsed = suspendUserSchema.safeParse({
      userId: formData.get('userId')?.toString(),
      reason: formData.get('reason')?.toString(),
      durationDays: formData.get('duration')?.toString(),
    })

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? 'Invalid suspension payload' }
    }

    const { userId, reason, durationDays } = parsed.data

    if (!UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    const sanitizedReason = sanitizeAdminText(reason)
    if (sanitizedReason.length < 20) {
      return { error: 'Suspension reason must remain at least 20 characters after sanitization' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

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
    const metadata: Json = {
      reason: sanitizedReason,
      duration_days: durationDays,
      suspended_by: session.user.id,
    }

    const { error: auditError } = await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'user_suspended',
      event_category: 'identity',
      severity: 'warning',
      user_id: session.user.id,
      action: 'suspend_user',
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
      error: error instanceof Error ? error.message : 'Failed to suspend user',
    }
  }
}
