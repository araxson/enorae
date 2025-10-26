'use server'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Json } from '@/lib/types/database.types'

/**
 * Log chain management actions to audit trail
 */
export async function logChainAudit(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string,
  chainId: string,
  eventType: string,
  severity: 'info' | 'warning' | 'critical',
  metadata: Json | null = null,
) {
  const { error } = await supabase.schema('audit').from('audit_logs').insert({
    event_type: eventType,
    event_category: 'chain_management',
    severity,
    user_id: userId,
    action: eventType,
    entity_type: 'chain',
    entity_id: chainId,
    metadata,
    is_success: true,
    target_schema: 'organization',
    target_table: 'salon_chains',
  })

  if (error) {
    console.error('[ChainAudit] Failed to record audit log', error)
  }
}
