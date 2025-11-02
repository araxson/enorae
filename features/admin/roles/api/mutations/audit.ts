'use server'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Json } from '@/lib/types/database.types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

type JsonRecord = Record<string, Json>

export async function logRoleAudit(
  supabase: ReturnType<typeof createServiceRoleClient>,
  actorId: string,
  eventType: string,
  severity: 'info' | 'warning' | 'critical',
  metadata: JsonRecord,
) {
  const logger = createOperationLogger('logRoleAudit', {})
  logger.start()

  const { error } = await supabase.schema('audit').from('audit_logs').insert({
    event_type: eventType,
    event_category: 'role_management',
    severity,
    user_id: actorId,
    action: eventType,
    entity_type: 'role',
    entity_id: typeof metadata['role_id'] === 'string' ? metadata['role_id'] : null,
    metadata,
    is_success: true,
    target_schema: 'identity',
    target_table: 'user_roles',
  })

  if (error) {
    console.error('[RoleAudit] Failed to record audit log', error)
  }
}
