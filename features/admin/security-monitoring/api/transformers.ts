import { randomUUID } from 'crypto'
import type { Database } from '@/lib/types/database.types'
import type {
  AccessAttempt,
  FailedLoginAttempt,
  FailedLoginSummary,
  IpAccessEvent,
  RateLimitRule,
  RateLimitViolation,
  SecurityEvent,
  SecurityIncident,
  SuspiciousSession,
} from '@/features/admin/security-monitoring/types'

// View types (all fields nullable)
type AuditLogViewRow = Database['identity']['Views']['audit_logs_view']['Row']
type AccessMonitoringViewRow = Database['public']['Views']['security_access_monitoring_view']['Row']
type SessionSecurityViewRow = Database['public']['Views']['security_session_security_view']['Row']
type RateLimitTrackingRow = Database['public']['Views']['security_rate_limit_tracking_view']['Row']
type RateLimitRuleRow = Database['public']['Views']['security_rate_limit_rules_view']['Row']

// Table types (required fields non-nullable)
type AuditLogRow = Database['audit']['Tables']['audit_logs']['Row']
type AccessMonitoringRow = Database['security']['Tables']['access_monitoring']['Row']
type SessionSecurityRow = Database['security']['Tables']['session_security']['Row']

export type {
  AuditLogViewRow,
  AuditLogRow,
  AccessMonitoringRow,
  AccessMonitoringViewRow,
  SessionSecurityRow,
  SessionSecurityViewRow,
  RateLimitTrackingRow,
  RateLimitRuleRow,
}

export const normalizeIp = (value: unknown): string | null => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const match = value.find((entry) => typeof entry === 'string')
    return match ?? null
  }
  if (value && typeof value === 'object') {
    const candidate = Object.values(value as Record<string, unknown>).find(
      (entry) => typeof entry === 'string'
    )
    return (candidate as string | undefined) ?? null
  }
  return null
}

export const toAccessAttempt = (row: AccessMonitoringViewRow): AccessAttempt => ({
  id: row.id ?? '',
  userId: row.user_id ?? null,
  resourceType: row.resource_type ?? '',
  action: row.action ?? '',
  isGranted: row.is_granted ?? false,
  ipAddress: normalizeIp(row.ip_address),
  userAgent: row.user_agent ?? null,
  createdAt: row.created_at ?? new Date().toISOString(),
})

export const toSuspiciousSession = (row: SessionSecurityViewRow): SuspiciousSession => ({
  id: row.id ?? '',
  userId: row.user_id ?? null,
  ipAddress: normalizeIp(row.ip_address),
  userAgent: row.user_agent ?? null,
  suspiciousScore: row.suspicious_score ?? 0,
  isBlocked: row.is_blocked ?? false,
  lastActivityAt: row.last_activity_at ?? null,
  createdAt: row.created_at ?? new Date().toISOString(),
})

export const toSecurityEvent = (row: AuditLogViewRow): SecurityEvent => ({
  id: row.id ?? '',
  eventType: row.action ?? 'unknown',
  severity: 'info' as string,
  eventCategory: null as string | null,
  description: row.error_message ?? null,
  metadata: null as Record<string, unknown> | null,
  userId: row.user_id,
  userEmail: null,
  ipAddress: normalizeIp(row.ip_address),
  createdAt: (row.created_at ?? new Date().toISOString()) as string,
})

export const toRateLimitViolation = (row: RateLimitTrackingRow): RateLimitViolation => ({
  id: (row.identifier ?? '') as string,
  identifier: (row.identifier ?? '') as string,
  identifierType: (row.identifier_type ?? '') as string,
  endpoint: (row.endpoint ?? '') as string,
  requestCount: (row.request_count ?? 0) as number,
  windowStartAt: (row.window_start_at ?? new Date().toISOString()) as string,
  lastRequestAt: (row.last_request_at ?? null) as string | null,
  lastBlockedAt: (row.last_blocked_at ?? null) as string | null,
  blockedUntil: (row.blocked_until ?? null) as string | null,
  userAgent: row.user_agent ?? null,
  metadata: (row.metadata as Record<string, unknown> | null) ?? null,
})

export const toRateLimitRule = (row: RateLimitRuleRow): RateLimitRule => ({
  id: (row.id ?? '') as string,
  ruleName: (row.rule_name ?? '') as string,
  endpoint: (row.endpoint ?? '') as string,
  appliesTo: (row.applies_to ?? '') as string,
  maxRequests: (row.max_requests ?? 0) as number,
  windowSeconds: (row.window_seconds ?? 0) as number,
  blockDurationSeconds: (row.block_duration_seconds ?? 0) as number,
  isActive: (row.is_active ?? false) as boolean,
})

export const toFailedLoginAttempt = (row: AuditLogViewRow): FailedLoginAttempt => ({
  id: (row.id ?? '') as string,
  userId: (row.user_id ?? '') as string,
  ipAddress: normalizeIp(row.ip_address),
  userAgent: (row.user_agent ?? '') as string,
  createdAt: (row.created_at ?? new Date().toISOString()) as string,
  metadata: null as Record<string, unknown> | null,
})

export const toIpAccessEvent = (row: AccessMonitoringViewRow): IpAccessEvent => ({
  id: row.id ?? '',
  ipAddress: normalizeIp(row.ip_address),
  isGranted: row.is_granted ?? false,
  resourceType: row.resource_type ?? '',
  action: row.action ?? '',
  userId: row.user_id ?? null,
  userAgent: row.user_agent ?? null,
  createdAt: row.created_at ?? new Date().toISOString(),
})

export const toIncident = (row: AuditLogRow): SecurityIncident => ({
  id: row.id,
  eventType: row.event_type,
  severity: row.severity ?? 'info',
  description: (row.metadata as { description?: string } | null)?.description ?? null,
  userId: row.user_id ?? null,
  ipAddress: normalizeIp(row.ip_address),
  metadata: (row.metadata as Record<string, unknown> | null) ?? null,
  createdAt: row.created_at,
})
