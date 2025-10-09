import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'

export interface AuditLog {
  id: string
  user_id: string
  impersonator_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  old_values: Record<string, any> | null
  new_values: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  request_id: string | null
  is_success: boolean
  error_message: string | null
  created_at: string
}

export interface SecurityAuditLog {
  id: string
  event_type: string
  severity: string
  user_id: string | null
  salon_id: string | null
  ip_address: string | null
  user_agent: string | null
  request_id: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export interface AuditLogFilters {
  action?: string
  entityType?: string
  startDate?: string
  endDate?: string
  userId?: string
  isSuccess?: boolean
}

export async function getAuditLogs(
  salonId: string,
  filters?: AuditLogFilters
): Promise<AuditLog[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  let query = supabase
    .schema('identity')
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // Apply filters
  if (filters?.action) {
    query = query.eq('action', filters.action)
  }

  if (filters?.entityType) {
    query = query.eq('entity_type', filters.entityType)
  }

  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate)
  }

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId)
  }

  if (filters?.isSuccess !== undefined) {
    query = query.eq('is_success', filters.isSuccess)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getSecurityAuditLogs(
  salonId: string,
  filters?: {
    eventType?: string
    severity?: string
    startDate?: string
    endDate?: string
  }
): Promise<SecurityAuditLog[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  let query = supabase
    .schema('identity')
    .from('security_audit_log')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(100)

  // Apply filters
  if (filters?.eventType) {
    query = query.eq('event_type', filters.eventType)
  }

  if (filters?.severity) {
    query = query.eq('severity', filters.severity)
  }

  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getAuditLogStats(salonId: string) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Get last 24 hours of audit logs
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const { data: auditLogs } = await supabase
    .schema('identity')
    .from('audit_logs')
    .select('action, is_success, created_at')
    .gte('created_at', oneDayAgo.toISOString())

  const { data: securityLogs } = await supabase
    .schema('identity')
    .from('security_audit_log')
    .select('severity, created_at')
    .eq('salon_id', salonId)
    .gte('created_at', oneDayAgo.toISOString())

  const totalEvents = (auditLogs?.length || 0) + (securityLogs?.length || 0)
  const failedActions = auditLogs?.filter(log => !log.is_success).length || 0
  const criticalEvents = securityLogs?.filter(log => log.severity === 'critical').length || 0
  const warningEvents = securityLogs?.filter(log => log.severity === 'warning').length || 0

  return {
    totalEvents,
    failedActions,
    criticalEvents,
    warningEvents,
    successRate: totalEvents > 0 ? ((totalEvents - failedActions) / totalEvents * 100) : 100
  }
}
