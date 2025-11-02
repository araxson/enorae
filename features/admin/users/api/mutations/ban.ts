import 'server-only'

import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole } from '@/lib/auth'
import { sanitizeAdminText } from '@/features/admin/admin-common/api/text-sanitizers'
import type { Json } from '@/lib/types/database.types'
import { banUserSchema, UUID_REGEX } from '../../constants'
import { createOperationLogger, logError } from '@/lib/observability/logger'

/**
 * Ban user permanently - requires super_admin role
 * Terminates all sessions and marks user as permanently banned
 */
export async function banUser(formData: FormData) {
  const logger = createOperationLogger('banUser', {})
  logger.start()

  try {
    const parsed = banUserSchema.safeParse({
      userId: formData.get('userId')?.toString(),
      reason: formData.get('reason')?.toString(),
      isPermanent: formData.get('permanent') === 'true',
    })

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? 'Invalid ban payload' }
    }

    const { userId, reason, isPermanent } = parsed.data

    if (!UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    const sanitizedReason = sanitizeAdminText(reason)
    if (sanitizedReason.length < 20) {
      return { error: 'Ban reason must remain at least 20 characters after sanitization' }
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
    const { error: rolesError } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: false,
        updated_by_id: session.user.id,
      })
      .eq('user_id', userId)

    if (rolesError) {
      console.error('[banUser] Failed to deactivate user roles:', rolesError)
      logger.error(rolesError, 'database')
      return { error: 'Failed to deactivate user roles' }
    }

    // Terminate all sessions
    const { error: sessionsError } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('user_id', userId)

    if (sessionsError) {
      console.error('[banUser] Failed to terminate user sessions:', sessionsError)
      logger.error(sessionsError, 'database')
      return { error: 'Failed to terminate user sessions' }
    }

    // Critical audit log
    const metadata: Json = {
      reason: sanitizedReason,
      is_permanent: isPermanent,
      banned_by: session.user.id,
    }

    const { error: auditError } = await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'user_banned',
      event_category: 'security',
      severity: 'critical',
      user_id: session.user.id,
      action: 'ban_user',
      entity_type: 'user',
      entity_id: userId,
      target_schema: 'identity',
      target_table: 'profiles',
      target_id: userId,
      metadata,
      is_success: true,
    })

    if (auditError) {
      // Log but don't fail - audit logging is important but shouldn't block the operation
      console.error('[banUser] Failed to log audit trail:', auditError)
      logger.error(auditError, 'database')
    }

    revalidatePath('/admin/users', 'page')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to ban user',
    }
  }
}
