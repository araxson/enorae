'use server'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Database } from '@/lib/types/database.types'

import type { RoleType } from '../../api/types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export type AssignmentPayload = {
  userId: string
  role: RoleType
  salonId?: string
  permissions?: string[]
}

export async function applyRoleAssignment(
  supabase: ReturnType<typeof createServiceRoleClient>,
  data: AssignmentPayload,
  actorId: string,
): Promise<string> {
  const logger = createOperationLogger('applyRoleAssignment', {})
  logger.start()

  let existingQuery = supabase
    .schema('identity')
    .from('user_roles')
    .select('id, is_active, permissions')
    .eq('user_id', data.userId)
    .eq('role', data.role)

  if (data.salonId) {
    existingQuery = existingQuery.eq('salon_id', data.salonId)
  } else {
    existingQuery = existingQuery.is('salon_id', null)
  }

  const { data: existing } = await existingQuery.maybeSingle()

  type UserRoleRow = Database['identity']['Tables']['user_roles']['Row']

  const permissions =
    data.permissions && data.permissions.length > 0 ? data.permissions : null

  if (existing) {
    const existingRole = existing as UserRoleRow
    const permissionsChanged =
      JSON.stringify(existingRole.permissions || []) !== JSON.stringify(permissions || [])

    if (!existingRole.is_active || permissionsChanged) {
      const { error } = await supabase
        .schema('identity')
        .from('user_roles')
        .update({
          is_active: true,
          updated_by_id: actorId,
          deleted_at: null,
          deleted_by_id: null,
          permissions,
        })
        .eq('id', existingRole.id)

      if (error) throw error
    }
    return existingRole.id
  }

  const { data: inserted, error } = await supabase
    .schema('identity')
    .from('user_roles')
    .insert({
      user_id: data.userId,
      role: data.role,
      salon_id: data.salonId || null,
      is_active: true,
      permissions,
      created_by_id: actorId,
      updated_by_id: actorId,
    })
    .select('id')
    .returns<Pick<Database['identity']['Tables']['user_roles']['Row'], 'id'>[]>()
    .single()

  if (error) throw error
  return inserted.id
}
