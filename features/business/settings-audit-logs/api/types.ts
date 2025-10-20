import type { Database } from '@/lib/types/database.types'

export interface AuditLog {
  id: string
  user_id: string
  impersonator_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  request_id: string | null
  is_success: boolean
  error_message: string | null
  created_at: string
}

export interface SecurityAuditLog {
  id: string
  event_type: string
  severity: string
  user_id: string | null
  salon_id: string | null
  ip_address: string | null
  user_agent: string | null
  request_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface AuditLogFilters {
  action?: string
  entityType?: string
  startDate?: string
  endDate?: string
  userId?: string
  isSuccess?: boolean
}

export type SecurityAuditFilters = {
  eventType?: string
  severity?: string
  startDate?: string
  endDate?: string
}

export type SecurityIncidentLogRow = Database['public']['Views']['security_incident_logs']['Row']
