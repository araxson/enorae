import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import {
  toAccessAttempt,
  toIncident,
  toRateLimitRule,
  toRateLimitViolation,
  toSecurityEvent,
  toSuspiciousSession,
  toIpAccessEvent,
  type AuditLogViewRow,
  type AuditLogRow,
  type AccessMonitoringViewRow,
  type SessionSecurityViewRow,
  type RateLimitTrackingRow,
  type RateLimitRuleRow,
} from '@/features/admin/security-monitoring/api/transformers'
import { groupFailedLogins } from '@/features/admin/security-monitoring/api/failed-logins'
import type {
  RateLimitViolation,
  SecurityMetric,
  SecurityMonitoringSnapshot,
} from '@/features/admin/security-monitoring/api/types'

interface SnapshotOptions {
  windowInHours?: number
  eventsLimit?: number
  sessionsLimit?: number
  accessAttemptsLimit?: number
  rateLimitLimit?: number
  failedLoginsLimit?: number
  incidentsLimit?: number
}

const DEFAULT_OPTIONS: Required<SnapshotOptions> = {
  windowInHours: 24,
  eventsLimit: 60,
  sessionsLimit: 25,
  accessAttemptsLimit: 60,
  rateLimitLimit: 40,
  failedLoginsLimit: 80,
  incidentsLimit: 40,
}

const createAuthedClient = async () => {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  return createServiceRoleClient()
}

const filterActiveViolations = (violations: RateLimitViolation[]) =>
  violations.filter((item) => item.blockedUntil || item.lastBlockedAt)

const buildDerivedMetrics = ({
  failedLoginCount,
  rateLimitViolations,
  blockedSessions,
  accessDeniedAttempts,
  highSeverityIncidents,
}: {
  failedLoginCount: number
  rateLimitViolations: number
  blockedSessions: number
  accessDeniedAttempts: number
  highSeverityIncidents: number
}): SecurityMetric[] => [
  {
    key: 'failed_logins_24h',
    label: 'Failed Logins (24h)',
    value: failedLoginCount,
    status: failedLoginCount > 50 ? 'warning' : failedLoginCount > 0 ? 'info' : 'healthy',
    threshold: 50,
  },
  {
    key: 'blocked_sessions',
    label: 'Blocked Sessions',
    value: blockedSessions,
    status: blockedSessions > 0 ? 'warning' : 'healthy',
    threshold: 0,
  },
  {
    key: 'rate_limit_violations',
    label: 'Rate Limit Violations',
    value: rateLimitViolations,
    status: rateLimitViolations > 0 ? 'warning' : 'healthy',
    threshold: 0,
  },
  {
    key: 'access_denied_attempts',
    label: 'Access Denied Attempts',
    value: accessDeniedAttempts,
    status: accessDeniedAttempts > 25 ? 'warning' : accessDeniedAttempts > 0 ? 'info' : 'healthy',
    threshold: 25,
  },
  {
    key: 'high_severity_incidents',
    label: 'High Severity Incidents',
    value: highSeverityIncidents,
    status: highSeverityIncidents > 0 ? 'critical' : 'healthy',
    threshold: 0,
  },
]

export async function getSecurityMetrics(): Promise<SecurityMetric[]> {
  const snapshot = await getSecurityMonitoringSnapshot()
  return snapshot.metrics
}

export async function getSecurityMonitoringSnapshot(
  options: SnapshotOptions = {}
): Promise<SecurityMonitoringSnapshot> {
  const settings = { ...DEFAULT_OPTIONS, ...options }
  const supabase = await createAuthedClient()
  const now = new Date()
  const startIso = new Date(now.getTime() - settings.windowInHours * 60 * 60 * 1000).toISOString()
  const endIso = now.toISOString()

  const [accessRes, sessionsRes, eventsRes, failedLoginsRes, rateTrackingRes, rateRulesRes, incidentsRes] =
    await Promise.all([
      supabase
        .from('security_access_monitoring_view')
        .select('id, user_id, action, resource_type, is_granted, ip_address, user_agent, created_at')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(settings.accessAttemptsLimit),
      supabase
        .from('security_session_security_view')
        .select('id, user_id, session_id, suspicious_score, is_blocked, ip_address, last_activity_at, created_at')
        .order('suspicious_score', { ascending: false })
        .limit(settings.sessionsLimit),
      supabase
        .schema('identity')
        .from('audit_logs_view')
        .select('id, user_id, action, error_message, ip_address, created_at')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(settings.eventsLimit),
      supabase
        .schema('identity')
        .from('audit_logs_view')
        .select('id, user_id, action, error_message, ip_address, created_at')
        .gte('created_at', startIso)
        .ilike('action', '%login%')
        .order('created_at', { ascending: false })
        .limit(settings.failedLoginsLimit),
      supabase
        .schema('public')
        .from('security_rate_limit_tracking_view')
        .select('identifier, identifier_type, endpoint, request_count, window_start_at, last_request_at, last_blocked_at, blocked_until, user_agent, metadata')
        .order('window_start_at', { ascending: false })
        .limit(settings.rateLimitLimit),
      supabase
        .schema('public')
        .from('security_rate_limit_rules_view')
        .select('id, rule_name, endpoint, applies_to, max_requests, window_seconds, block_duration_seconds, is_active')
        .limit(settings.rateLimitLimit),
      supabase
        .schema('audit')
        .from('audit_logs')
        .select('id, user_id, action, event_type, event_category, severity, error_message, target_schema, target_table, metadata, ip_address, created_at')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(settings.incidentsLimit),
    ])

  // Type guard for access monitoring view rows (nullable fields from view)
  const isAccessMonitoringViewRow = (row: unknown): row is AccessMonitoringViewRow => {
    if (!row || typeof row !== 'object') return false
    const record = row as Record<string, unknown>
    // Views have nullable fields, so we just check that it's an object with some expected properties
    return (
      (typeof record['id'] === 'string' || record['id'] === null) &&
      (typeof record['created_at'] === 'string' || record['created_at'] === null)
    )
  }

  // Type guard for session security view rows (nullable fields from view)
  const isSessionSecurityViewRow = (row: unknown): row is SessionSecurityViewRow => {
    if (!row || typeof row !== 'object') return false
    const record = row as Record<string, unknown>
    return (
      (typeof record['id'] === 'string' || record['id'] === null) &&
      (typeof record['suspicious_score'] === 'number' || record['suspicious_score'] === null)
    )
  }

  const accessRows = (accessRes.data ?? []).filter(isAccessMonitoringViewRow)
  const accessAttempts = accessRows.map(toAccessAttempt)
  if (accessRes.error) console.error('[SecurityMonitoring] Access query failed', accessRes.error)

  const suspiciousSessions = (sessionsRes.data ?? []).filter(isSessionSecurityViewRow).map(toSuspiciousSession)
  if (sessionsRes.error) console.error('[SecurityMonitoring] Session query failed', sessionsRes.error)

  // Type guard for audit log view rows (all fields nullable from view)
  const isAuditLogViewRow = (row: unknown): row is AuditLogViewRow => {
    if (!row || typeof row !== 'object') return false
    const record = row as Record<string, unknown>
    return (
      (typeof record['id'] === 'string' || record['id'] === null) &&
      (typeof record['created_at'] === 'string' || record['created_at'] === null)
    )
  }

  // Filter and transform events with proper type guards
  const eventsData = eventsRes.data ?? []
  const recentEvents = eventsData.filter(isAuditLogViewRow).map(toSecurityEvent)
  if (eventsRes.error) console.error('[SecurityMonitoring] Audit events query failed', eventsRes.error)

  // Filter and transform failed logins with proper type guards
  const failedLoginsData = failedLoginsRes.data ?? []
  const failedLoginRows = failedLoginsData.filter(isAuditLogViewRow)
  if (failedLoginsRes.error) console.error('[SecurityMonitoring] Failed login query failed', failedLoginsRes.error)
  const failedLoginSummary = groupFailedLogins(failedLoginRows)

  // Type guard for rate limit tracking rows (view with nullable fields)
  const isRateLimitTrackingRow = (row: unknown): row is RateLimitTrackingRow => {
    if (!row || typeof row !== 'object') return false
    const record = row as Record<string, unknown>
    return (
      (typeof record['identifier'] === 'string' || record['identifier'] === null) &&
      (typeof record['window_start_at'] === 'string' || record['window_start_at'] === null)
    )
  }

  // Type guard for rate limit rule rows (view with nullable fields)
  const isRateLimitRuleRow = (row: unknown): row is RateLimitRuleRow => {
    if (!row || typeof row !== 'object') return false
    const record = row as Record<string, unknown>
    return (
      (typeof record['id'] === 'string' || record['id'] === null) &&
      (typeof record['rule_name'] === 'string' || record['rule_name'] === null)
    )
  }

  // Type guard for audit log rows (table with required fields)
  const isAuditLogRow = (row: unknown): row is AuditLogRow => {
    if (!row || typeof row !== 'object') return false
    const record = row as Record<string, unknown>
    return (
      typeof record['id'] === 'string' &&
      typeof record['created_at'] === 'string' &&
      typeof record['action'] === 'string' &&
      typeof record['event_type'] === 'string' &&
      typeof record['event_category'] === 'string' &&
      typeof record['target_schema'] === 'string' &&
      typeof record['target_table'] === 'string'
    )
  }

  const rateLimitViolationRows = (rateTrackingRes.data ?? []).filter(isRateLimitTrackingRow)
  if (rateTrackingRes.error) console.error('[SecurityMonitoring] Rate tracking query failed', rateTrackingRes.error)
  const rateLimitViolations = filterActiveViolations(rateLimitViolationRows.map(toRateLimitViolation))

  const rateLimitRules = (rateRulesRes.data ?? []).filter(isRateLimitRuleRow).map(toRateLimitRule)
  if (rateRulesRes.error) console.error('[SecurityMonitoring] Rate rules query failed', rateRulesRes.error)

  const incidents = (incidentsRes.data ?? []).filter(isAuditLogRow).map(toIncident)
  if (incidentsRes.error) console.error('[SecurityMonitoring] Incident query failed', incidentsRes.error)

  const blockedSessions = suspiciousSessions.filter((session) => Boolean(session.isBlocked)).length
  const accessDeniedAttempts = accessAttempts.filter((attempt) => !attempt.isGranted).length
  const highSeverityIncidents = incidents.filter((incident) =>
    ['high', 'critical'].includes((incident.severity ?? '').toLowerCase())
  ).length

  const metrics = buildDerivedMetrics({
    failedLoginCount: failedLoginRows.length,
    rateLimitViolations: rateLimitViolations.length,
    blockedSessions,
    accessDeniedAttempts,
    highSeverityIncidents,
  })

  const overview = {
    totalAuditEvents: recentEvents.length,
    highSeverityEvents: recentEvents.filter((event) =>
      ['high', 'critical', 'error'].includes(event.severity.toLowerCase())
    ).length,
    failedLoginAttempts: failedLoginSummary.total,
    activeIncidents: highSeverityIncidents,
    blockedSessions,
  }

  return {
    timeframe: { start: startIso, end: endIso },
    overview,
    metrics,
    recentEvents,
    accessAttempts,
    suspiciousSessions,
    failedLoginSummary,
    rateLimitViolations,
    rateLimitRules,
    ipAccess: accessRows.map(toIpAccessEvent),
    incidents,
  }
}
