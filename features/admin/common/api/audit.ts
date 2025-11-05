import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Json } from '@/lib/types/database.types'

interface AuditParams {
  supabase: SupabaseClient<Database>
  event: string
  userId: string
  metadata?: Json
}

type AuditEventType = 'admin_query' | 'admin_mutation'
type AuditCategory = 'data_access' | 'data_change'

const insertAuditLog = async ({
  supabase,
  eventType,
  category,
  event,
  userId,
  metadata,
}: AuditParams & { eventType: AuditEventType; category: AuditCategory }) => {
  await supabase
    .schema('audit')
    .from('audit_logs')
    .insert({
      event_type: eventType,
      event_category: category,
      severity: 'info',
      action: event,
      user_id: userId,
      entity_type: 'admin_portal',
      entity_id: event,
      target_schema: 'public',
      target_table: 'admin_activity',
      metadata: metadata ?? null,
      is_success: true,
    })
}

/**
 * Record read-only admin portal activity in the audit schema.
 * Errors are logged but do not block the calling query.
 */
export async function recordAdminQueryAudit({ supabase, event, userId, metadata }: AuditParams): Promise<void> {
  try {
    await insertAuditLog({
      supabase,
      eventType: 'admin_query',
      category: 'data_access',
      event,
      userId,
      metadata,
    })
  } catch (error) {
    console.error('[AdminAudit] Failed to record query audit', { event, error })
  }
}

/**
 * Record admin mutation activity in the audit schema.
 */
export async function recordAdminMutationAudit({ supabase, event, userId, metadata }: AuditParams): Promise<void> {
  try {
    await insertAuditLog({
      supabase,
      eventType: 'admin_mutation',
      category: 'data_change',
      event,
      userId,
      metadata,
    })
  } catch (error) {
    console.error('[AdminAudit] Failed to record mutation audit', { event, error })
  }
}
