import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type AdminUserRole = Database['public']['Views']['user_roles_view']['Row']

type RoleStat = { total: number; active: number; inactive: number }

export interface RoleAuditEvent {
  id: string
  createdAt: string
  action: string
  userId: string | null
  actorId: string | null
  entityId: string | null
  metadata: Record<string, unknown> | null
}

/**
 * Get all role assignments
 * SECURITY: Platform admin only
 */
export async function getAllRoleAssignments(): Promise<AdminUserRole[]> {
  const logger = createOperationLogger('getAllRoleAssignments', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('user_roles_view')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get user's role assignments
 * SECURITY: Platform admin only
 */
export async function getUserRoleAssignments(userId: string): Promise<AdminUserRole[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('user_roles_view')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get salon's role assignments (staff members)
 * SECURITY: Platform admin only
 */
export async function getSalonRoleAssignments(salonId: string): Promise<AdminUserRole[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('user_roles_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get role distribution stats
 * SECURITY: Platform admin only
 */
export async function getRoleStats() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data } = await supabase
    .from('user_roles_view')
    .select('role, is_active')

  const stats = (data || []).reduce<Record<string, RoleStat>>((acc, { role, is_active }) => {
    const key = String(role)
    if (!acc[key]) {
      acc[key] = { total: 0, active: 0, inactive: 0 }
    }
    acc[key].total += 1
    if (is_active) {
      acc[key].active += 1
    } else {
      acc[key].inactive += 1
    }
    return acc
  }, {})

  return stats
}

/** Fetch recent role-related audit events */
export async function getRoleAuditTimeline(limit = 100): Promise<RoleAuditEvent[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .schema('identity')
    .from('audit_logs_view')
    .select('id, created_at, action, user_id, entity_id, impersonator_id')
    .ilike('action', 'role%')
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<Database['identity']['Views']['audit_logs_view']['Row'][]>()

  if (error) throw error

  const rows = data ?? []

  return rows.map((row) => ({
    id: row.id ?? '',
    createdAt: row.created_at ?? new Date().toISOString(),
    action: row.action ?? 'unknown',
    userId: row.user_id,
    actorId: row.impersonator_id,
    entityId: row.entity_id,
    metadata: (row.new_values as Record<string, unknown> | null) ?? null,
  }))
}
