import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type SecurityAccessViewRow = Database['public']['Views']['security_access_monitoring_view']['Row']

export interface SecurityAccessRecord {
  id: string
  user_id: string
  user_email: string
  access_type: string
  endpoint: string
  status: 'success' | 'blocked' | 'flagged'
  ip_address: string
  user_agent: string
  risk_score: number
  accessed_at: string
  acknowledged_at: string | null
  acknowledgement_status: 'pending' | 'acknowledged' | 'dismissed'
}

// Transform database view row to SecurityAccessRecord
// Database is source of truth - mapping actual columns to expected interface
function transformToSecurityAccessRecord(row: SecurityAccessViewRow): SecurityAccessRecord {
  return {
    id: row.id ?? '',
    user_id: row.user_id ?? '',
    user_email: '', // Not available in database view
    access_type: row.action ?? '',
    endpoint: row.resource_type ?? '',
    status: row.is_granted ? 'success' : 'blocked',
    ip_address: String(row.ip_address ?? ''),
    user_agent: row.user_agent ?? '',
    risk_score: 0, // Not available in database view
    accessed_at: row.created_at ?? '',
    acknowledged_at: null, // Not available in database view
    acknowledgement_status: 'pending', // Not available in database view
  }
}

export interface SecurityAccessSnapshot {
  records: SecurityAccessRecord[]
  totalCount: number
  blockedCount: number
  flaggedCount: number
  pendingCount: number
}

export async function getSecurityAccessMonitoring(
  options: { limit?: number; offset?: number } = {},
): Promise<SecurityAccessSnapshot> {
  const logger = createOperationLogger('getSecurityAccessMonitoring', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const limit = options.limit ?? 100
  const offset = options.offset ?? 0

  // Fetch main access monitoring data
  const { data: records, error } = await supabase
    .from('security_access_monitoring_view')
    .select('*')
    .order('accessed_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch security access records:', error)
    return {
      records: [],
      totalCount: 0,
      blockedCount: 0,
      flaggedCount: 0,
      pendingCount: 0,
    }
  }

  // Get counts
  const { count: totalCount } = await supabase
    .from('security_access_monitoring_view')
    .select('*', { count: 'exact', head: true })

  const { count: blockedCount } = await supabase
    .from('security_access_monitoring_view')
    .select('*', { count: 'exact', head: true })
    .eq('is_granted', false)

  const { count: flaggedCount } = await supabase
    .from('security_access_monitoring_view')
    .select('*', { count: 'exact', head: true })
    .eq('is_granted', false)

  // Database view doesn't have acknowledgement_status column
  const pendingCount = 0

  return {
    records: (records ?? []).map(transformToSecurityAccessRecord),
    totalCount: totalCount ?? 0,
    blockedCount: blockedCount ?? 0,
    flaggedCount: flaggedCount ?? 0,
    pendingCount,
  }
}

export async function getSecurityAccessDetail(
  accessId: string,
): Promise<SecurityAccessRecord | null> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data: record, error } = await supabase
    .from('security_access_monitoring_view')
    .select('*')
    .eq('id', accessId)
    .single()

  if (error) {
    console.error('Failed to fetch security access detail:', error)
    return null
  }

  return record ? transformToSecurityAccessRecord(record) : null
}
