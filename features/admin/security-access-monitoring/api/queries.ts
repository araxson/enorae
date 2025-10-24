import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole } from '@/lib/auth/role-guard'
import { ROLE_GROUPS } from '@/lib/auth/constants'

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
    .eq('status', 'blocked')

  const { count: flaggedCount } = await supabase
    .from('security_access_monitoring_view')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'flagged')

  const { count: pendingCount } = await supabase
    .from('security_access_monitoring_view')
    .select('*', { count: 'exact', head: true })
    .eq('acknowledgement_status', 'pending')

  return {
    records: (records as SecurityAccessRecord[]) ?? [],
    totalCount: totalCount ?? 0,
    blockedCount: blockedCount ?? 0,
    flaggedCount: flaggedCount ?? 0,
    pendingCount: pendingCount ?? 0,
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

  return (record as SecurityAccessRecord) ?? null
}
