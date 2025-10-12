'use server'

import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function logRoleAudit(
  supabase: ReturnType<typeof createServiceRoleClient>,
  actorId: string,
  eventType: string,
  severity: 'info' | 'warning' | 'critical',
  metadata: Record<string, unknown>,
) {
  const { error } = await supabase.schema('audit').from('audit_logs').insert({
    event_type: eventType,
    event_category: 'role_management',
    severity,
    user_id: actorId,
    action: eventType,
    entity_type: 'role',
    entity_id: (metadata.role_id as string | undefined) ?? null,
    metadata,
    is_success: true,
  })

  if (error) {
    console.error('[RoleAudit] Failed to record audit log', error)
  }
}
