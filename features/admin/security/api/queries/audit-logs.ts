import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type AuditLogRow = Database['public']['Views']['security_incident_logs_view']['Row']

export interface AuditLog {
  id: string
  event_type: string
  user_id: string | null
  resource_type: string | null
  resource_id: string | null
  event_data: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  user_email?: string | null
  user_name?: string | null
}

export interface SecurityEvent {
  id: string
  event_type: string
  severity: string
  user_id: string | null
  ip_address: string | null
  event_details: Record<string, unknown> | null
  created_at: string
  user_email?: string | null
}

const NORMALIZED_SEVERITY_FALLBACK = 'info'

const normalizeIp = (value: AuditLogRow['ip_address']): string | null => {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    const first = value.find((entry) => typeof entry === 'string')
    return first ?? null
  }
  return null
}

const toAuditLog = (row: AuditLogRow): AuditLog => ({
  id: row.id ?? '',
  event_type: row.event_type ?? '',
  user_id: row.user_id ?? null,
  resource_type: row.entity_type ?? null,
  resource_id: row.entity_id ?? null,
  event_data: row.new_values as Record<string, unknown> | null,
  ip_address: normalizeIp(row.ip_address),
  user_agent: row.user_agent ?? null,
  created_at: row.created_at ?? new Date().toISOString(),
  user_email: null,
  user_name: null,
})

const toSecurityEvent = (row: AuditLogRow): SecurityEvent => ({
  id: row.id ?? '',
  event_type: row.event_type ?? '',
  severity: row.severity ?? (row.is_success === false ? 'warning' : NORMALIZED_SEVERITY_FALLBACK),
  user_id: row.user_id ?? null,
  ip_address: normalizeIp(row.ip_address),
  event_details: row.new_values as Record<string, unknown> | null,
  created_at: row.created_at ?? new Date().toISOString(),
  user_email: null,
})


/**
 * Get audit logs with optional filters
 */
export async function getAuditLogs(filters?: {
  eventType?: string
  userId?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
}): Promise<AuditLog[]> {
  const logger = createOperationLogger('getAuditLogs', {})
  logger.start()
  // SECURITY: Require platform admin
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  let query = supabase.from('security_incident_logs_view').select('*')

  if (filters?.eventType) {
    query = query.eq('event_type', filters.eventType)
  }

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId)
  }

  if (filters?.dateFrom) {
    query = query.gte('created_at', filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte('created_at', filters.dateTo)
  }

  query = query.order('created_at', { ascending: false }).limit(filters?.limit || 100)

  const { data, error } = await query

  if (error) {
    console.error('Audit logs query error:', error)
    return []
  }

  return (data ?? []).map(toAuditLog)
}

/**
 * Get security events (failed logins, suspicious activity)
 */
export async function getSecurityEvents(filters?: {
  severity?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
}): Promise<SecurityEvent[]> {
  // SECURITY: Require platform admin
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  let query = supabase.from('security_incident_logs_view').select('*')

  if (filters?.severity) {
    query = query.eq('severity', filters.severity)
  }

  if (filters?.dateFrom) {
    query = query.gte('created_at', filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte('created_at', filters.dateTo)
  }

  query = query.order('created_at', { ascending: false}).limit(filters?.limit || 100)

  const { data, error } = await query

  if (error) {
    console.error('Security events query error:', error)
    return []
  }

  return (data ?? []).map(toSecurityEvent)
}

/**
 * Get overview statistics
 */
export async function getSecurityOverview(dateFrom: string, dateTo: string) {
  // SECURITY: Require platform admin
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const [auditLogs, securityEvents] = await Promise.all([
    getAuditLogs({ dateFrom, dateTo, limit: 1000 }),
    getSecurityEvents({ dateFrom, dateTo, limit: 1000 }),
  ])

  const failedLogins = securityEvents.filter(
    (e) => e.event_type === 'failed_login' || e.event_type === 'login_failed'
  ).length

  const suspiciousActivity = securityEvents.filter(
    (e) => e.severity === 'high' || e.severity === 'critical'
  ).length

  return {
    totalAuditLogs: auditLogs.length,
    totalSecurityEvents: securityEvents.length,
    failedLogins,
    suspiciousActivity,
    eventsByType: auditLogs.reduce(
      (acc, log) => {
        acc[log.event_type] = (acc[log.event_type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    ),
  }
}
