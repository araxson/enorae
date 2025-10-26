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
} from '@/features/admin/security-monitoring/api/helpers'
import type {
  AuditLogRow,
  AccessMonitoringRow,
  SessionSecurityRow,
  RateLimitTrackingRow,
  RateLimitRuleRow,
  SecurityAuditLogRow,
} from '@/features/admin/security-monitoring/api/helpers'
import { groupFailedLogins } from '@/features/admin/security-monitoring/api/failed-logins'
import type {
  RateLimitViolation,
  SecurityMetric,
  SecurityMonitoringSnapshot,
} from '@/features/admin/security-monitoring/types'

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
        .select('*')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(settings.accessAttemptsLimit),
      supabase
        .from('security_session_security_view')
        .select('*')
        .order('suspicious_score', { ascending: false })
        .limit(settings.sessionsLimit),
      supabase
        .schema('identity')
        .from('audit_logs_view')
        .select('*')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(settings.eventsLimit),
      supabase
        .schema('identity')
        .from('audit_logs_view')
        .select('*')
        .gte('created_at', startIso)
        .ilike('action', '%login%')
        .order('created_at', { ascending: false })
        .limit(settings.failedLoginsLimit),
      supabase
        .schema('public')
        .from('security_rate_limit_tracking_view')
        .select('*')
        .order('window_start_at', { ascending: false })
        .limit(settings.rateLimitLimit),
      supabase
        .schema('public')
        .from('security_rate_limit_rules_view')
        .select('*')
        .limit(settings.rateLimitLimit),
      supabase
        .schema('audit')
        .from('audit_logs')
        .select('*')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(settings.incidentsLimit),
    ])

  const accessRows = (accessRes.data ?? []) as AccessMonitoringRow[]
  const accessAttempts = accessRows.map(toAccessAttempt)
  if (accessRes.error) console.error('[SecurityMonitoring] Access query failed', accessRes.error)

  const suspiciousSessions = ((sessionsRes.data ?? []) as SessionSecurityRow[]).map(toSuspiciousSession)
  if (sessionsRes.error) console.error('[SecurityMonitoring] Session query failed', sessionsRes.error)

  const recentEvents = ((eventsRes.data ?? []) as AuditLogRow[]).map(toSecurityEvent)
  if (eventsRes.error) console.error('[SecurityMonitoring] Audit events query failed', eventsRes.error)

  const failedLoginRows = ((failedLoginsRes.data ?? []) as AuditLogRow[])
  if (failedLoginsRes.error) console.error('[SecurityMonitoring] Failed login query failed', failedLoginsRes.error)
  const failedLoginSummary = groupFailedLogins(failedLoginRows)

  const rateLimitViolationRows = (rateTrackingRes.data ?? []) as RateLimitTrackingRow[]
  if (rateTrackingRes.error) console.error('[SecurityMonitoring] Rate tracking query failed', rateTrackingRes.error)
  const rateLimitViolations = filterActiveViolations(rateLimitViolationRows.map(toRateLimitViolation))

  const rateLimitRules = ((rateRulesRes.data ?? []) as RateLimitRuleRow[]).map(toRateLimitRule)
  if (rateRulesRes.error) console.error('[SecurityMonitoring] Rate rules query failed', rateRulesRes.error)

  const incidents = ((incidentsRes.data ?? []) as SecurityAuditLogRow[]).map(toIncident)
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
