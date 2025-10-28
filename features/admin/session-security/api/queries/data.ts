import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Database } from '@/lib/types/database.types'

type SessionSecurityViewRow =
  Database['public']['Views']['security_session_security_view']['Row']

function normalizeIp(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const match = value.find((entry) => typeof entry === 'string')
    return match ?? ''
  }
  return ''
}

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

function toSessionSecurityRecord(row: SessionSecurityViewRow): SessionSecurityRecord {
  const suspiciousScore = row.suspicious_score ?? 0
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  if (suspiciousScore >= 90) riskLevel = 'critical'
  else if (suspiciousScore >= 70) riskLevel = 'high'
  else if (suspiciousScore >= 40) riskLevel = 'medium'

  return {
    id: row.id ?? '',
    user_id: row.user_id ?? '',
    user_email: '', // Not in view, would need join
    session_id: row.session_id ?? '',
    risk_score: suspiciousScore,
    risk_level: riskLevel,
    has_mfa: false, // Not in view, would need join
    mfa_enabled_at: null, // Not in view
    ip_address: normalizeIp(row.ip_address),
    device_fingerprint: '', // Not in view
    last_activity: row.last_activity_at ?? new Date().toISOString(),
    created_at: row.created_at ?? new Date().toISOString(),
    security_flags: row.is_blocked ? ['blocked'] : [],
    requires_mfa_override: false, // Not in view
  }
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
    records: (records ?? []).map(toSessionSecurityRecord),
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

  return record ? toSessionSecurityRecord(record) : null
}
