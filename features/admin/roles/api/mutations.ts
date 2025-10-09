'use server'

import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type RoleType = Database['public']['Enums']['role_type']

const assignRoleSchema = z.object({
  userId: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  role: z.enum([
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
  ]),
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
})

/**
 * Assign role to user
 * SECURITY: Platform admin only
 */
export async function assignRole(formData: FormData) {
  try {
    const result = assignRoleSchema.safeParse({
      userId: formData.get('userId')?.toString(),
      role: formData.get('role')?.toString(),
      salonId: formData.get('salonId')?.toString() || undefined,
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { userId, role, salonId } = result.data

    // Validate: Business/staff roles require salon_id
    const rolesThatNeedSalon: RoleType[] = [
      'tenant_owner',
      'salon_owner',
      'salon_manager',
      'senior_staff',
      'staff',
      'junior_staff',
    ]

    if (rolesThatNeedSalon.includes(role) && !salonId) {
      return { error: `Role ${role} requires a salon assignment` }
    }

    // Check if role already exists
    let existingQuery = supabase
      .from('user_roles')
      .select('id, is_active')
      .eq('user_id', userId)
      .eq('role', role)

    if (salonId) {
      existingQuery = existingQuery.eq('salon_id', salonId)
    } else {
      existingQuery = existingQuery.is('salon_id', null)
    }

    const { data: existing } = await existingQuery.maybeSingle()

    const existingRole = existing as { id: string; is_active: boolean } | null
    if (existingRole) {
      // Reactivate if exists but inactive
      if (!existingRole.is_active) {
        const { error: updateError } = await supabase
          .schema('identity')
          .from('user_roles')
          .update({
            is_active: true,
            updated_by_id: session.user.id,
          })
          .eq('id', existingRole.id)

        if (updateError) return { error: updateError.message }
        revalidatePath('/admin/roles')
        return { success: true }
      }

      return { error: 'User already has this role' }
    }

    // Insert new role
    const { error: insertError } = await supabase
      .schema('identity')
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role,
        salon_id: salonId || null,
        is_active: true,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })

    if (insertError) return { error: insertError.message }

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
