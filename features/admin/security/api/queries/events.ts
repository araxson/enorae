import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'
import { QUERY_LIMITS } from '@/lib/config/constants'

type SecurityIncidentLogRow = Database['public']['Views']['security_incident_logs_view']['Row']
type AuditLogRow = Pick<SecurityIncidentLogRow, 'id' | 'user_id' | 'action' | 'entity_type' | 'entity_id' | 'event_type' | 'event_category' | 'is_success' | 'ip_address' | 'user_agent' | 'severity' | 'created_at'>

/**
 * Get security events with filtering
 * Returns audit logs filtered by severity and event type
 */
export async function getSecurityEvents(filters: {
  severity?: 'info' | 'warning' | 'error' | 'critical'
  event_type?: string
  user_id?: string
  startDate?: string
  endDate?: string
  limit?: number
}): Promise<AuditLogRow[]> {
  const logger = createOperationLogger('getSecurityEvents', {})
  logger.start()
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  let query = supabase
    .from('security_incident_logs_view')
    .select('id, user_id, action, entity_type, entity_id, event_type, event_category, is_success, ip_address, user_agent, severity, created_at')
    .order('created_at', { ascending: false })

  // Note: severity and event_type filtering is done on action field instead
  if (filters.event_type) {
    query = query.ilike('action', `%${filters.event_type}%`)
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id)
  }

  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate)
  }

  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  } else {
    query = query.limit(QUERY_LIMITS.MEDIUM_LIST)
  }

  const { data, error } = await query

  if (error) throw error

  return (data || []) as unknown as AuditLogRow[]
}

/**
 * Get critical security events (errors and critical severity)
 */
export async function getCriticalSecurityEvents(limit: number = QUERY_LIMITS.DEFAULT_LIST): Promise<AuditLogRow[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('security_incident_logs_view')
    .select('id, user_id, action, entity_type, entity_id, event_type, event_category, is_success, ip_address, severity, created_at')
    .eq('is_success', false)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data || []) as unknown as AuditLogRow[]
}

/**
 * Get failed login attempts and security anomalies
 */
export async function getFailedAuthAttempts(hoursBack: number = 24): Promise<{
  total_failed_attempts: number
  suspicious_users: Array<{ userId: string; failedAttempts: number }>
  recent_events: AuditLogRow[]
}> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const cutoffDate = new Date()
  cutoffDate.setHours(cutoffDate.getHours() - hoursBack)

  const { data, error } = await supabase
    .from('security_incident_logs_view')
    .select('id, user_id, action, event_type, event_category, is_success, ip_address, created_at')
    .eq('event_category', 'security')
    .eq('is_success', false)
    .gte('created_at', cutoffDate.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error

  // Group by user_id to identify potential attacks
  const attemptsByUser = (data || []).reduce(
    (acc: Record<string, number>, log) => {
      const userId = log.user_id || 'unknown'
      acc[userId] = (acc[userId] || 0) + 1
      return acc
    },
    {}
  )

  // Find users with multiple failed attempts (potential brute force)
  const suspiciousUsers = Object.entries(attemptsByUser)
    .filter(([_, count]) => count >= 5)
    .map(([userId, count]) => ({ userId, failedAttempts: count }))

  return {
    total_failed_attempts: data?.length || 0,
    suspicious_users: suspiciousUsers,
    recent_events: (data || []) as unknown as AuditLogRow[],
  }
}
