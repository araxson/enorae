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

type AuditLogRow = Database['audit']['Tables']['audit_logs']['Row']
type AccessMonitoringRow = Database['security']['Tables']['access_monitoring']['Row']
type SessionSecurityRow = Database['security']['Tables']['session_security']['Row']
type RateLimitTrackingRow = Database['public']['Views']['security_rate_limit_tracking_view']['Row']
type RateLimitRuleRow = Database['public']['Views']['security_rate_limit_rules_view']['Row']
type SecurityAuditLogRow = Database['audit']['Tables']['audit_logs']['Row']

export type {
  AuditLogRow,
  AccessMonitoringRow,
  SessionSecurityRow,
  RateLimitTrackingRow,
  RateLimitRuleRow,
  SecurityAuditLogRow,
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

export const toAccessAttempt = (row: AccessMonitoringRow): AccessAttempt => ({
  id: row.id ?? '',
  userId: row.user_id,
  resourceType: row.resource_type,
  action: row.action,
  isGranted: row.is_granted ?? false,
  ipAddress: normalizeIp(row.ip_address),
  userAgent: row.user_agent,
  createdAt: row.created_at ?? new Date().toISOString(),
})

export const toSuspiciousSession = (row: SessionSecurityRow): SuspiciousSession => ({
  id: row.id ?? '',
  userId: row.user_id,
  ipAddress: normalizeIp(row.ip_address),
  userAgent: row.user_agent,
  suspiciousScore: row.suspicious_score ?? 0,
  isBlocked: row.is_blocked ?? false,
  lastActivityAt: row.last_activity_at,
  createdAt: row.created_at,
})

export const toSecurityEvent = (row: AuditLogRow): SecurityEvent => ({
  id: row.id ?? '',
  eventType: row.event_type ?? row.action ?? 'unknown',
  severity: (row.severity ?? 'info') as string,
  eventCategory: (row.event_category ?? null) as string | null,
  description: row.error_message ?? null,
  metadata: (row.metadata as Record<string, unknown> | null) ?? null,
  userId: row.user_id,
  userEmail: (row.metadata as { user_email?: string } | null)?.user_email ?? null,
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

export const toFailedLoginAttempt = (row: AuditLogRow): FailedLoginAttempt => ({
  id: (row.id ?? '') as string,
  userId: (row.user_id ?? '') as string,
  ipAddress: normalizeIp(row.ip_address),
  userAgent: (row.user_agent ?? '') as string,
  createdAt: (row.created_at ?? new Date().toISOString()) as string,
  metadata: (row.metadata as Record<string, unknown> | null) ?? null,
})

export const toIpAccessEvent = (row: AccessMonitoringRow): IpAccessEvent => ({
  id: row.id,
  ipAddress: normalizeIp(row.ip_address),
  isGranted: row.is_granted,
  resourceType: row.resource_type,
  action: row.action,
  userId: row.user_id,
  userAgent: row.user_agent,
  createdAt: row.created_at,
})

export const toIncident = (row: SecurityAuditLogRow): SecurityIncident => ({
  id: row.id ?? randomUUID(),
  eventType: row.event_type ?? 'security_incident',
  severity: row.severity ?? 'info',
  description: (row.metadata as { description?: string } | null)?.description ?? null,
  userId: row.user_id,
  ipAddress: normalizeIp(row.ip_address),
  metadata: (row.metadata as Record<string, unknown> | null) ?? null,
  createdAt: row.created_at ?? new Date().toISOString(),
})
