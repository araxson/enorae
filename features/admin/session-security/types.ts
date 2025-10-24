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
