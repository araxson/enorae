import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export interface SessionSecurityRecord {
  id: string
  user_id: string
  user_email: string
  session_id: string
  risk_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  has_mfa: boolean
  mfa_enabled_at: string | null
  ip_address: string
  device_fingerprint: string
  last_activity: string
  created_at: string
  security_flags: string[]
  requires_mfa_override: boolean
}

export interface SessionSecuritySnapshot {
  records: SessionSecurityRecord[]
  totalCount: number
  criticalCount: number
  highRiskCount: number
  mfaEnabledCount: number
}

export async function getSessionSecurityMonitoring(
  options: { limit?: number; offset?: number } = {},
): Promise<SessionSecuritySnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const limit = options.limit ?? 100
  const offset = options.offset ?? 0

  // Fetch main session security data
  const { data: records, error } = await supabase
    .from('security_session_security_view')
    .select('*')
    .order('risk_score', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch session security records:', error)
    return {
      records: [],
      totalCount: 0,
      criticalCount: 0,
      highRiskCount: 0,
      mfaEnabledCount: 0,
    }
  }

  // Get counts
  const { count: totalCount } = await supabase
    .from('security_session_security_view')
    .select('*', { count: 'exact', head: true })

  const { count: criticalCount } = await supabase
    .from('security_session_security_view')
    .select('*', { count: 'exact', head: true })
    .eq('risk_level', 'critical')

  const { count: highRiskCount } = await supabase
    .from('security_session_security_view')
    .select('*', { count: 'exact', head: true })
    .eq('risk_level', 'high')

  const { count: mfaEnabledCount } = await supabase
    .from('security_session_security_view')
    .select('*', { count: 'exact', head: true })
    .eq('has_mfa', true)

  return {
    records: (records as SessionSecurityRecord[]) ?? [],
    totalCount: totalCount ?? 0,
    criticalCount: criticalCount ?? 0,
    highRiskCount: highRiskCount ?? 0,
    mfaEnabledCount: mfaEnabledCount ?? 0,
  }
}

export async function getSessionSecurityDetail(
  sessionId: string,
): Promise<SessionSecurityRecord | null> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data: record, error } = await supabase
    .from('security_session_security_view')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) {
    console.error('Failed to fetch session security detail:', error)
    return null
  }

  return (record as SessionSecurityRecord) ?? null
}
