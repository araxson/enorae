export interface SecurityIncidentRecord {
  id: string
  event_type: string
  severity: 'info' | 'warning' | 'critical'
  user_email: string | null
  description: string
  impacted_resources: string[]
  remediation_status: 'pending' | 'in_progress' | 'resolved'
  occurred_at: string
  created_at: string
}

export interface SecurityIncidentsSnapshot {
  incidents: SecurityIncidentRecord[]
  totalCount: number
  criticalCount: number
  pendingCount: number
}
