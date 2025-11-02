'use server'

import { requireAnyRole, ROLE_GROUPS, canAccessSalon } from '@/lib/auth'
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'
import type {
  AuditLog,
  AuditLogFilters,
  SecurityAuditFilters,
  SecurityAuditLog,
  SecurityIncidentLogRow,
} from './types'

type AuditClientOptions = {
  PostgrestVersion?: string
}

type MinimalAuditSchema = {
  Tables: {
    security_incident_logs: {
      Row: SecurityIncidentLogRow
      Insert: SecurityIncidentLogRow
      Update: SecurityIncidentLogRow
      Relationships: []
    }
  }
  Views: Record<string, never>
  Functions: Record<string, never>
}

export type IncidentQuery = PostgrestFilterBuilder<
  AuditClientOptions,
  MinimalAuditSchema,
  SecurityIncidentLogRow,
  SecurityIncidentLogRow[],
  unknown,
  unknown,
  unknown
>

export async function ensureSalonAccess(salonId: string): Promise<void> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized')
  }
}

export function applyAuditFilters(query: IncidentQuery, filters?: AuditLogFilters): IncidentQuery {
  if (!filters) return query

  if (filters['action']) {
    query = query.eq('action', filters['action'])
  }
  if (filters.entityType) {
    query = query.eq('entity_type', filters.entityType)
  }
  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate)
  }
  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate)
  }
  if (filters.userId) {
    query = query.eq('user_id', filters.userId)
  }
  if (filters.isSuccess !== undefined) {
    query = query.eq('is_success', filters.isSuccess)
  }

  return query
}

export function applySecurityFilters(
  query: IncidentQuery,
  filters?: SecurityAuditFilters,
): IncidentQuery {
  if (!filters) return query

  if (filters.eventType) {
    query = query.eq('event_type', filters.eventType)
  }
  if (filters['severity']) {
    query = query.eq('severity', filters['severity'])
  }
  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate)
  }
  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate)
  }

  return query
}

export function mapIncidentToAuditLog(row: SecurityIncidentLogRow): AuditLog {
  return {
    id: row['id'] ?? '',
    user_id: row['user_id'] ?? '',
    impersonator_id: row['impersonator_id'] ?? null,
    action: row['action'] ?? row['event_type'] ?? 'unknown',
    entity_type: row['entity_type'] ?? 'unknown',
    entity_id: row['entity_id'] ?? null,
    old_values: normalizeRecord(row['old_values']),
    new_values: normalizeRecord(row['new_values']),
    ip_address: toStringOrNull(row['ip_address']),
    user_agent: row['user_agent'] ?? null,
    request_id: row['request_id'] ?? null,
    is_success: row['is_success'] ?? true,
    error_message: row['error_message'] ?? null,
    created_at: row['created_at'] ?? new Date().toISOString(),
  }
}

export function mapIncidentToSecurityAuditLog(row: SecurityIncidentLogRow): SecurityAuditLog {
  return {
    id: row['id'] ?? '',
    event_type: row['event_type'] ?? row['action'] ?? 'unknown',
    severity: row['severity'] ?? 'info',
    user_id: row['user_id'] ?? null,
    salon_id: row['salon_id'] ?? null,
    ip_address: toStringOrNull(row['ip_address']),
    user_agent: row['user_agent'] ?? null,
    request_id: row['request_id'] ?? null,
    metadata: normalizeRecord(row['metadata']),
    created_at: row['created_at'] ?? new Date().toISOString(),
  }
}

function normalizeRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return null
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}
