import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'
import { QUERY_LIMITS } from '@/lib/config/constants'

type AuditLogRow = Database['public']['Views']['security_incident_logs_view']['Row']

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
}) {
  const logger = createOperationLogger('getSecurityEvents', {})
  logger.start()
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  let query = supabase
    .from('security_incident_logs_view')
    .select('*')
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

  return data || []
}

/**
 * Get critical security events (errors and critical severity)
 */
export async function getCriticalSecurityEvents(limit: number = QUERY_LIMITS.DEFAULT_LIST) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('security_incident_logs_view')
    .select('*')
    .eq('is_success', false)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return data || []
}

/**
 * Get failed login attempts and security anomalies
 */
export async function getFailedAuthAttempts(hoursBack: number = 24) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const cutoffDate = new Date()
  cutoffDate.setHours(cutoffDate.getHours() - hoursBack)

  const { data, error } = await supabase
    .from('security_incident_logs_view')
    .select('*')
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
    recent_events: data || [],
  }
}

/**
 * Get admin action summary
 * Shows what admins have been doing
 */
export async function getAdminActivitySummary(daysBack: number = 7) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysBack)

  const { data, error } = await supabase
    .from('security_incident_logs_view')
    .select('*')
    .in('action', [
      'suspend_user',
      'ban_user',
      'reactivate_user',
      'approve_salon',
      'reject_salon',
      'suspend_salon',
      'hide_review',
      'ban_review_author',
    ])
    .gte('created_at', cutoffDate.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error

  // Group by action type
  const actionCounts = (data || []).reduce(
    (acc: Record<string, number>, log) => {
      const action = log.action || 'unknown'
      acc[action] = (acc[action] || 0) + 1
      return acc
    },
    {}
  )

  // Group by admin user
  const adminCounts = (data || []).reduce(
    (acc: Record<string, number>, log) => {
      const adminId = log.user_id || 'unknown'
      acc[adminId] = (acc[adminId] || 0) + 1
      return acc
    },
    {}
  )

  return {
    period_days: daysBack,
    total_admin_actions: data?.length || 0,
    actions_by_type: actionCounts,
    actions_by_admin: adminCounts,
    recent_actions: (data || []).slice(0, 20),
  }
}

/**
 * Get system health metrics
 */
export async function getSystemHealthMetrics() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  // Get error rate in last hour
  const oneHourAgo = new Date()
  oneHourAgo.setHours(oneHourAgo.getHours() - 1)

  const { data: recentLogs } = await supabase
    .from('security_incident_logs_view')
    .select('is_success')
    .gte('created_at', oneHourAgo.toISOString())

  const totalEvents = recentLogs?.length || 0
  const failedEvents = recentLogs?.filter((log) => !log.is_success).length || 0
  const errorRate = totalEvents > 0 ? (failedEvents / totalEvents) * 100 : 0

  // Get database operations log
  const { data: dbOps } = await supabase
    .from('database_operations_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)

  return {
    error_rate_last_hour: errorRate.toFixed(2) + '%',
    total_events_last_hour: totalEvents,
    failed_events_last_hour: failedEvents,
    last_db_operation: dbOps?.[0] || null,
    health_status: errorRate < 5 ? 'healthy' : errorRate < 15 ? 'degraded' : 'critical',
  }
}

/**
 * Get data integrity alerts
 */
export async function getDataIntegrityAlerts() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const alerts: Array<{ type: string; message: string; severity: string }> = []

  // Check for orphaned appointments (no customer)
  const { count: orphanedAppointments } = await supabase
    .from('appointments_view')
    .select('id', { count: 'exact', head: true })
    .is('customer_id', null)

  if (orphanedAppointments && orphanedAppointments > 0) {
    alerts.push({
      type: 'orphaned_appointments',
      message: `${orphanedAppointments} appointments without customers`,
      severity: 'warning',
    })
  }

  // Check for reviews without ratings
  const { count: invalidReviews } = await supabase
    .from('salon_reviews_view')
    .select('id', { count: 'exact', head: true })
    .is('rating', null)

  if (invalidReviews && invalidReviews > 0) {
    alerts.push({
      type: 'invalid_reviews',
      message: `${invalidReviews} reviews without ratings`,
      severity: 'warning',
    })
  }

  // Check for salons without settings
  const { data: salonRows } = await supabase
    .from('salons_view')
    .select('id')

  const { data: settingsRows } = await supabase
    .from('salon_settings_view')
    .select('salon_id')

  const salonIds = new Set((salonRows ?? []).map((row) => row.id).filter((id): id is string => id !== null))
  const settingsIds = new Set((settingsRows ?? []).map((row) => row.salon_id).filter((id): id is string => id !== null))

  const salonsMissingSettings = Array.from(salonIds).filter((id) => !settingsIds.has(id)).length

  if (salonsMissingSettings > 0) {
    alerts.push({
      type: 'missing_salon_settings',
      message: `${salonsMissingSettings} salons without settings`,
      severity: 'info',
    })
  }

  return {
    total_alerts: alerts.length,
    alerts,
    checked_at: new Date().toISOString(),
  }
}
