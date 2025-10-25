import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { canAccessSalon } from '@/lib/auth/permissions/salon-access'
import type { Database } from '@/lib/types/database.types'

export interface AuditLog {
  id: string
  user_id: string
  impersonator_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
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
  metadata: Record<string, unknown> | null
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

type SecurityIncidentLogRow = Database['public']['Views']['security_incident_logs']['Row']

function normalizeRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return null
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

async function ensureSalonAccess(salonId: string): Promise<void> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized')
  }
}

function mapIncidentToAuditLog(row: SecurityIncidentLogRow): AuditLog {
  return {
    id: row['id'] ?? '',
    user_id: row['user_id'] ?? '',
    impersonator_id: row['impersonator_id'] ?? null,
    action: row['action'] ?? row['event_type'] ?? 'unknown',
    entity_type: row['entity_type'] ?? 'unknown',
    entity_id: row['entity_id'] ?? null,
    old_values: normalizeRecord(row['old_values']) ?? null,
    new_values: normalizeRecord(row['new_values']) ?? null,
    ip_address: toStringOrNull(row['ip_address']),
    user_agent: row['user_agent'] ?? null,
    request_id: row['request_id'] ?? null,
    is_success: row['is_success'] ?? true,
    error_message: row['error_message'] ?? null,
    created_at: row['created_at'] ?? new Date().toISOString(),
  }
}

function mapIncidentToSecurityAuditLog(row: SecurityIncidentLogRow): SecurityAuditLog {
  return {
    id: row['id'] ?? '',
    event_type: row['event_type'] ?? row['action'] ?? 'unknown',
    severity: row['severity'] ?? 'info',
    user_id: row['user_id'] ?? null,
    salon_id: row['salon_id'] ?? null,
    ip_address: toStringOrNull(row['ip_address']),
    user_agent: row['user_agent'] ?? null,
    request_id: row['request_id'] ?? null,
    metadata: normalizeRecord(row['metadata']) ?? null,
    created_at: row['created_at'] ?? new Date().toISOString(),
  }
}

export async function getAuditLogs(
  salonId: string,
  filters?: AuditLogFilters
): Promise<AuditLog[]> {
  await ensureSalonAccess(salonId)

  const supabase = await createClient()

  let query = supabase
    .from('security_incident_logs')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (filters?.['action']) {
    query = query.eq('action', filters['action'])
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

  if (error) {
    throw error
  }

  const rows = (data ?? []) as SecurityIncidentLogRow[]

  return rows.filter((row) => Boolean(row?.['id'] && row?.['user_id'])).map(mapIncidentToAuditLog)
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
  await ensureSalonAccess(salonId)

  const supabase = await createClient()

  let query = supabase
    .from('security_incident_logs')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (filters?.eventType) {
    query = query.eq('event_type', filters.eventType)
  }

  if (filters?.['severity']) {
    query = query.eq('severity', filters['severity'])
  }

  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  const rows = (data ?? []) as SecurityIncidentLogRow[]

  return rows
    .filter((row) => Boolean(row?.['id'] && (row?.['event_type'] || row?.['action'])))
    .map(mapIncidentToSecurityAuditLog)
}

export async function getAuditLogStats(salonId: string) {
  await ensureSalonAccess(salonId)

  const supabase = await createClient()

  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const { data, error } = await supabase
    .from('security_incident_logs')
    .select('id, is_success, severity, created_at')
    .eq('salon_id', salonId)
    .gte('created_at', oneDayAgo.toISOString())

  if (error) {
    throw error
  }

  const rows =
    (data ?? []) as Array<{
      id: string | null
      is_success: boolean | null
      severity: string | null
      created_at: string | null
    }>

  const normalizedRows = rows.filter((row) => Boolean(row['id'] && row['created_at']))

  const totalEvents = normalizedRows.length
  const failedActions = normalizedRows.filter((row) => row['is_success'] === false).length
  const criticalEvents = normalizedRows.filter(
    (row) => (row['severity'] ?? '').toLowerCase() === 'critical'
  ).length
  const warningEvents = normalizedRows.filter(
    (row) => (row['severity'] ?? '').toLowerCase() === 'warning'
  ).length

  return {
    totalEvents,
    failedActions,
    criticalEvents,
    warningEvents,
    successRate: totalEvents > 0 ? ((totalEvents - failedActions) / totalEvents) * 100 : 100,
  }
}