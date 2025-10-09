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
  SecurityMetric,
  SuspiciousSession,
} from './types'

type AuditLogRow = Database['audit']['Tables']['audit_logs']['Row']
type AccessMonitoringRow = Database['security']['Tables']['access_monitoring']['Row']
type SessionSecurityRow = Database['security']['Tables']['session_security']['Row']
type RateLimitTrackingRow = Database['security']['Tables']['rate_limit_tracking']['Row']
type RateLimitRuleRow = Database['security']['Tables']['rate_limit_rules']['Row']
type SecurityAuditLogRow = Database['security']['Tables']['security_audit_log']['Row']
type SecurityMetricRow =
  Database['security']['Functions']['get_security_metrics']['Returns'][number]

export type { AuditLogRow, AccessMonitoringRow, SessionSecurityRow, RateLimitTrackingRow, RateLimitRuleRow, SecurityAuditLogRow, SecurityMetricRow }

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

export const toMetric = (row: SecurityMetricRow): SecurityMetric => ({
  key: row.metric_name ?? 'unknown_metric',
  label: (row.metric_name ?? 'Unknown Metric')
    .split(/[_-]/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(' '),
  value: Number(row.metric_value ?? 0),
  status: (row.status ?? 'unknown') as SecurityMetric['status'],
  threshold: Number.isFinite(row.threshold as number) ? Number(row.threshold) : null,
  trend: row.trend_value ? Number(row.trend_value) : null,
})

export const toAccessAttempt = (row: AccessMonitoringRow): AccessAttempt => ({
  id: row.id,
  userId: row.user_id,
  resourceType: row.resource_type,
  action: row.action,
  isGranted: row.is_granted,
  ipAddress: normalizeIp(row.ip_address),
  userAgent: row.user_agent,
  createdAt: row.created_at,
})

export const toSuspiciousSession = (row: SessionSecurityRow): SuspiciousSession => ({
  id: row.id,
  userId: row.user_id,
  ipAddress: normalizeIp(row.ip_address),
  userAgent: row.user_agent,
  suspiciousScore: row.suspicious_score,
  isBlocked: row.is_blocked,
  lastActivityAt: row.last_activity_at,
  createdAt: row.created_at,
})

export const toSecurityEvent = (row: AuditLogRow): SecurityEvent => ({
  id: row.id,
  eventType: row.event_type ?? row.action ?? 'unknown',
  severity: row.severity ?? 'info',
  eventCategory: row.event_category ?? null,
  description: row.error_message,
  metadata: (row.metadata as Record<string, unknown> | null) ?? null,
  userId: row.user_id,
  userEmail: (row.metadata as { user_email?: string } | null)?.user_email ?? null,
  ipAddress: normalizeIp(row.ip_address),
  createdAt: row.created_at,
})

export const toRateLimitViolation = (row: RateLimitTrackingRow): RateLimitViolation => ({
  id: row.identifier,
  identifier: row.identifier,
  identifierType: row.identifier_type,
  endpoint: row.endpoint,
  requestCount: row.request_count,
  windowStartAt: row.window_start_at,
  lastRequestAt: row.last_request_at,
  lastBlockedAt: row.last_blocked_at,
  blockedUntil: row.blocked_until,
  userAgent: row.user_agent,
  metadata: (row.metadata as Record<string, unknown> | null) ?? null,
})

export const toRateLimitRule = (row: RateLimitRuleRow): RateLimitRule => ({
  id: row.id,
  ruleName: row.rule_name,
  endpoint: row.endpoint,
  appliesTo: row.applies_to,
  maxRequests: row.max_requests,
  windowSeconds: row.window_seconds,
  blockDurationSeconds: row.block_duration_seconds,
  isActive: row.is_active,
})

export const toFailedLoginAttempt = (row: AuditLogRow): FailedLoginAttempt => ({
  id: row.id,
  userId: row.user_id,
  ipAddress: normalizeIp(row.ip_address),
  userAgent: row.user_agent,
  createdAt: row.created_at,
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
