'use server'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Database, Json } from '@/lib/types/database.types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function logDashboardAudit(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string,
  eventType: string,
  severity: 'info' | 'warning' | 'critical',
  metadata?: Json,
) {
  const logger = createOperationLogger('logDashboardAudit', {})
  logger.start()

  const metadataObject = metadata ?? null
  const entityId =
    metadataObject && typeof metadataObject === 'object' && !Array.isArray(metadataObject)
      ? ((metadataObject as { entity_id?: Json }).entity_id as string | undefined) ?? null
      : null

  const payload: Database['audit']['Tables']['audit_logs']['Insert'] = {
    action: eventType,
    created_at: new Date().toISOString(),
    entity_id: entityId,
    entity_type: 'admin_operation',
    error_message: null,
    event_category: 'admin_operations',
    event_type: eventType,
    id: undefined,
    impersonator_id: null,
    ip_address: null,
    is_success: true,
    metadata: metadataObject,
    new_values: null,
    old_values: null,
    request_id: null,
    salon_id: null,
    severity,
    target_id: entityId,
    target_schema: 'public',
    target_table: 'admin_dashboard_events',
    user_agent: null,
    user_id: userId,
  }

  const { error } = await supabase.schema('audit').from('audit_logs').insert(payload)

  if (error) {
    console.error('[DashboardAudit] Failed to record audit log', error)
  }
}
