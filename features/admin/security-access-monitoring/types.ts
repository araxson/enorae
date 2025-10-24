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
