'use server'

import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type RoleType = Database['public']['Enums']['role_type']

type AssignmentPayload = {
  userId: string
  role: RoleType
  salonId?: string
  permissions?: string[]
}

const roleSchema = z.enum([
  'super_admin',
  'platform_admin',
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
  'customer',
  'vip_customer',
  'guest',
])

const assignmentSchema = z.object({
  userId: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  role: roleSchema,
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  permissions: z.array(z.string()).max(25).optional(),
})

const bulkSchema = z.array(assignmentSchema).min(1).max(50)

const ROLES_NEEDING_SALON: RoleType[] = [
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
]

async function applyRoleAssignment(data: AssignmentPayload, actorId: string) {
  const supabase = createServiceRoleClient()

  let existingQuery = supabase
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
  const existingRole = existing as { id: string; is_active: boolean; permissions: string[] | null } | null

  const permissions = data.permissions && data.permissions.length > 0 ? data.permissions : null

  if (existingRole) {
    if (!existingRole.is_active || JSON.stringify(existingRole.permissions || []) !== JSON.stringify(permissions || [])) {
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
    return
  }

  const { error } = await supabase
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

  if (error) throw error
}

function parsePermissions(raw: FormDataEntryValue | null) {
  if (!raw) return undefined
  if (Array.isArray(raw)) return undefined

  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed as string[]
    }
  } catch (error) {
    return undefined
  }
  return undefined
}

/**
 * Assign role to user
 * SECURITY: Platform admin only
 */
export async function assignRole(formData: FormData) {
  try {
    const result = assignmentSchema.safeParse({
      userId: formData.get('userId')?.toString(),
      role: formData.get('role')?.toString(),
      salonId: formData.get('salonId')?.toString() || undefined,
      permissions: parsePermissions(formData.get('permissions')),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    const data = result.data

    if (ROLES_NEEDING_SALON.includes(data.role) && !data.salonId) {
      return { error: `Role ${data.role} requires a salon assignment` }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    await applyRoleAssignment(data, session.user.id)

    revalidatePath('/admin/roles')
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to assign role',
    }
  }
}

/**
 * Bulk assign roles from a JSON payload
 */
export async function bulkAssignRoles(formData: FormData) {
  try {
    const payloadRaw = formData.get('payload')?.toString()
    if (!payloadRaw) {
      return { error: 'Missing bulk payload' }
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(payloadRaw)
    } catch (error) {
      return { error: 'Invalid bulk payload JSON' }
    }

    const validation = bulkSchema.safeParse(parsed)
    if (!validation.success) {
      return { error: validation.error.errors[0]?.message || 'Invalid bulk payload' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

    const results = { success: 0, failed: 0, errors: [] as string[] }
    for (const assignment of validation.data) {
      if (ROLES_NEEDING_SALON.includes(assignment.role) && !assignment.salonId) {
        results.failed += 1
        results.errors.push(`Role ${assignment.role} requires a salon for user ${assignment.userId}`)
        continue
      }

      try {
        await applyRoleAssignment(assignment, session.user.id)
        results.success += 1
      } catch (error) {
        results.failed += 1
        results.errors.push(
          error instanceof Error
            ? `${assignment.userId}: ${error.message}`
            : `${assignment.userId}: unable to assign role`
        )
      }
    }

    revalidatePath('/admin/roles')
    revalidatePath('/admin/users')

    return results
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to process bulk assignment',
    }
  }
}

/**
 * Update role permissions
 * SECURITY: Platform admin only
 */
export async function updateRolePermissions(formData: FormData) {
  try {
    const roleId = formData.get('roleId')?.toString()
    if (!roleId || !UUID_REGEX.test(roleId)) {
      return { error: 'Invalid role ID' }
    }

    const permissions = parsePermissions(formData.get('permissions')) || []

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({ permissions, updated_by_id: session.user.id })
      .eq('id', roleId)

    if (error) return { error: error.message }

    revalidatePath('/admin/roles')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update permissions',
    }
  }
}

/**
 * Revoke role from user (deactivate)
 * SECURITY: Platform admin only
 */
export async function revokeRole(formData: FormData) {
  try {
    const roleId = formData.get('roleId')?.toString()
    if (!roleId || !UUID_REGEX.test(roleId)) {
      return { error: 'Invalid role ID' }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: false,
        updated_by_id: session.user.id,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', roleId)

    if (error) return { error: error.message }

    revalidatePath('/admin/roles')
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to revoke role',
    }
  }
}

/**
 * Delete role permanently
 * SECURITY: Super admin only
 */
export async function deleteRole(formData: FormData) {
  try {
    const roleId = formData.get('roleId')?.toString()
    if (!roleId || !UUID_REGEX.test(roleId)) {
      return { error: 'Invalid role ID' }
    }

    // SECURITY: Require SUPER_ADMIN
    await requireAnyRole(['super_admin'])
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .delete()
      .eq('id', roleId)

    if (error) return { error: error.message }

    revalidatePath('/admin/roles')
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete role',
    }
  }
}
