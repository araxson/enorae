'use server'

import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function logDashboardAudit(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string,
  eventType: string,
  severity: 'info' | 'warning' | 'critical',
  metadata: Record<string, unknown>,
) {
  const { error } = await supabase.schema('audit').from('audit_logs').insert({
    event_type: eventType,
    event_category: 'admin_operations',
    severity,
    user_id: userId,
    action: eventType,
    entity_type: 'admin_operation',
    entity_id: (metadata.entity_id as string | undefined) ?? null,
    metadata,
    is_success: true,
  })

  if (error) {
    console.error('[DashboardAudit] Failed to record audit log', error)
  }
}
