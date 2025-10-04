import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export type AuditLog = {
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

export type SecurityEvent = {
  id: string
  event_type: string
  severity: string
  user_id: string | null
  ip_address: string | null
  event_details: Record<string, unknown> | null
  created_at: string
  user_email?: string | null
}

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
  // SECURITY: Require platform admin
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  // Query from public audit_logs view
  let query = supabase.from('audit_logs').select(`
    id,
    event_type,
    user_id,
    resource_type,
    resource_id,
    event_data,
    ip_address,
    user_agent,
    created_at
  `)

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
    // If view doesn't exist or schema mismatch, return empty array
    console.error('Audit logs query error:', error)
    return []
  }

  // Type guard: only return if data has expected structure
  if (!data || !Array.isArray(data)) return []

  // Filter out any error objects and type cast
  const filtered = (data as unknown[]).filter(
    (item): item is AuditLog =>
      item !== null && typeof item === 'object' && !('error' in item)
  )
  return filtered
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

  const supabase = await createClient()

  // Query from public audit_logs view (security events are in audit_logs)
  let query = supabase.from('audit_logs').select(`
    id,
    event_type:action,
    severity,
    user_id,
    ip_address,
    event_details:details,
    created_at
  `)

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
    // If view doesn't exist or schema mismatch, return empty array
    console.error('Security events query error:', error)
    return []
  }

  // Type guard: only return if data has expected structure
  if (!data || !Array.isArray(data)) return []

  // Filter out any error objects and type cast
  const filtered = (data as unknown[]).filter(
    (item): item is SecurityEvent =>
      item !== null && typeof item === 'object' && !('error' in item)
  )
  return filtered
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
