import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import {
  toAccessAttempt,
  toIncident,
  toMetric,
  toRateLimitRule,
  toRateLimitViolation,
  toSecurityEvent,
  toSuspiciousSession,
  toIpAccessEvent,
} from './helpers'
import { groupFailedLogins } from './failed-logins'
import type {
  RateLimitViolation,
  SecurityMetric,
  SecurityMonitoringSnapshot,
} from './types'

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

export async function getSecurityMetrics(): Promise<SecurityMetric[]> {
  const supabase = await createAuthedClient()
  const { data, error } = await supabase.rpc('get_security_metrics')

  if (error) {
    console.error('[SecurityMonitoring] Failed to load metrics', error)
    return []
  }

  return (data ?? []).map(toMetric)
}

export async function getSecurityMonitoringSnapshot(
  options: SnapshotOptions = {}
): Promise<SecurityMonitoringSnapshot> {
  const settings = { ...DEFAULT_OPTIONS, ...options }
  const supabase = await createAuthedClient()
  const securitySchema = supabase.schema('security')
  const auditSchema = supabase.schema('audit')
  const now = new Date()
  const startIso = new Date(now.getTime() - settings.windowInHours * 60 * 60 * 1000).toISOString()
  const endIso = now.toISOString()

  const [metricsRes, accessRes, sessionsRes, eventsRes, failedLoginsRes, rateTrackingRes, rateRulesRes, incidentsRes] =
    await Promise.all([
      supabase.rpc('get_security_metrics'),
      securitySchema
        .from('access_monitoring')
        .select('*')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(settings.accessAttemptsLimit),
      securitySchema
        .from('session_security')
        .select('*')
        .order('suspicious_score', { ascending: false })
        .limit(settings.sessionsLimit),
      auditSchema
        .from('audit_logs')
        .select('*')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(settings.eventsLimit),
      auditSchema
        .from('audit_logs')
        .select('*')
        .gte('created_at', startIso)
        .or('event_type.eq.failed_login,event_type.eq.login_failed,action.eq.login_failed')
        .order('created_at', { ascending: false })
        .limit(settings.failedLoginsLimit),
      securitySchema
        .from('rate_limit_tracking')
        .select('*')
        .order('window_start_at', { ascending: false })
        .limit(settings.rateLimitLimit),
      securitySchema
        .from('rate_limit_rules')
        .select('*')
        .order('priority', { ascending: true }),
      securitySchema
        .from('security_audit_log')
        .select('*')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(settings.incidentsLimit),
    ])

  const metrics = metricsRes.data ? metricsRes.data.map(toMetric) : []
  if (metricsRes.error) console.error('[SecurityMonitoring] Metrics query failed', metricsRes.error)

  const accessRows = accessRes.data ?? []
  const accessAttempts = accessRows.map(toAccessAttempt)
  if (accessRes.error) console.error('[SecurityMonitoring] Access query failed', accessRes.error)

  const suspiciousSessions = sessionsRes.data ? sessionsRes.data.map(toSuspiciousSession) : []
  if (sessionsRes.error) console.error('[SecurityMonitoring] Session query failed', sessionsRes.error)

  const recentEvents = eventsRes.data ? eventsRes.data.map(toSecurityEvent) : []
  if (eventsRes.error) console.error('[SecurityMonitoring] Audit events query failed', eventsRes.error)

  const failedLoginRows = failedLoginsRes.data ?? []
  if (failedLoginsRes.error) console.error('[SecurityMonitoring] Failed login query failed', failedLoginsRes.error)
  const failedLoginSummary = groupFailedLogins(failedLoginRows)

  const rateLimitViolations = rateTrackingRes.data
    ? filterActiveViolations(rateTrackingRes.data.map(toRateLimitViolation))
    : []
  if (rateTrackingRes.error) console.error('[SecurityMonitoring] Rate tracking query failed', rateTrackingRes.error)

  const rateLimitRules = rateRulesRes.data ? rateRulesRes.data.map(toRateLimitRule) : []
  if (rateRulesRes.error) console.error('[SecurityMonitoring] Rate rules query failed', rateRulesRes.error)

  const incidents = incidentsRes.data ? incidentsRes.data.map(toIncident) : []
  if (incidentsRes.error) console.error('[SecurityMonitoring] Incident query failed', incidentsRes.error)

  const overview = {
    totalAuditEvents: recentEvents.length,
    highSeverityEvents: recentEvents.filter((event) =>
      ['high', 'critical', 'error'].includes(event.severity.toLowerCase())
    ).length,
    failedLoginAttempts: failedLoginSummary.total,
    activeIncidents: incidents.filter((incident) =>
      ['high', 'critical'].includes(incident.severity.toLowerCase())
    ).length,
    blockedSessions: suspiciousSessions.filter((session) => Boolean(session.isBlocked)).length,
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
