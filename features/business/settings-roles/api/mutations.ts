'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getSalonContext, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const VALID_ROLES = [
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
] as const

const userRoleSchema = z.object({
  user_id: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  role: z.enum(VALID_ROLES, {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  permissions: z.array(z.string()).optional(),
})

export type ActionResult = {
  success?: boolean
  error?: string
  data?: unknown
}

/**
 * Assign role to user
 */
export async function assignUserRole(formData: FormData): Promise<ActionResult> {
  try {
    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { accessibleSalonIds } = await getSalonContext()
    if (!accessibleSalonIds.length) {
      return { error: 'User salon not found' }
    }

    // Parse and validate input
    const input = {
      user_id: formData.get('userId') as string,
      role: formData.get('role') as string,
      salon_id: formData.get('salonId') as string || undefined,
      permissions: formData.get('permissions')
        ? JSON.parse(formData.get('permissions') as string)
        : undefined,
    }

    const validated = userRoleSchema.parse(input)

    // Verify salon access
    if (validated.salon_id && !accessibleSalonIds.includes(validated.salon_id)) {
      return { error: 'Unauthorized to assign roles for this salon' }
    }

    const supabase = await createClient()

    // Check if user already has a role for this salon
    const { data: existingRole } = await supabase
      .schema('identity')
      .from('user_roles')
      .select('id')
      .eq('user_id', validated.user_id)
      .eq('salon_id', validated.salon_id || accessibleSalonIds[0])
      .is('deleted_at', null)
      .single()

    if (existingRole) {
      return { error: 'User already has a role for this salon' }
    }

    // Assign role
    const { data, error } = await supabase
      .schema('identity')
      .from('user_roles')
      .insert({
        user_id: validated.user_id,
        role: validated.role,
        salon_id: validated.salon_id || accessibleSalonIds[0],
        permissions: validated.permissions || [],
        is_active: true,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/settings/roles')

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Failed to assign user role' }
  }
}

/**
 * Update user role
 */
export async function updateUserRole(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid role ID' }
    }

    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { accessibleSalonIds } = await getSalonContext()
    if (!accessibleSalonIds.length) {
      return { error: 'User salon not found' }
    }

    const supabase = await createClient()

    // Verify role belongs to accessible salon
    const { data: roleData } = await supabase
      .schema('identity')
      .from('user_roles')
      .select('salon_id')
      .eq('id', id)
      .single<{ salon_id: string | null }>()

    if (!roleData || (roleData.salon_id && !accessibleSalonIds.includes(roleData.salon_id))) {
      return { error: 'Role not found or unauthorized' }
    }

    // Parse input
    const role = formData.get('role') as string
    const permissions = formData.get('permissions')
      ? JSON.parse(formData.get('permissions') as string)
      : undefined

    // Update role
    const { data, error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        role: role as typeof VALID_ROLES[number],
        permissions: permissions || [],
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/settings/roles')

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Failed to update user role' }
  }
}

/**
 * Deactivate user role (soft delete)
 */
export async function deactivateUserRole(id: string): Promise<ActionResult> {
  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid role ID' }
    }

    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { accessibleSalonIds } = await getSalonContext()
    if (!accessibleSalonIds.length) {
      return { error: 'User salon not found' }
    }

    const supabase = await createClient()

    // Verify role belongs to accessible salon
    const { data: roleData } = await supabase
      .schema('identity')
      .from('user_roles')
      .select('salon_id')
      .eq('id', id)
      .single<{ salon_id: string | null }>()

    if (!roleData || (roleData.salon_id && !accessibleSalonIds.includes(roleData.salon_id))) {
      return { error: 'Role not found or unauthorized' }
    }

    // Deactivate role (soft delete)
    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/settings/roles')

    return { success: true }
  } catch {
    return { error: 'Failed to deactivate user role' }
  }
}

/**
 * Reactivate user role
 */
export async function reactivateUserRole(id: string): Promise<ActionResult> {
  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid role ID' }
    }

    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { accessibleSalonIds } = await getSalonContext()
    if (!accessibleSalonIds.length) {
      return { error: 'User salon not found' }
    }

    const supabase = await createClient()

    // Verify role belongs to accessible salon
    const { data: roleData } = await supabase
      .schema('identity')
      .from('user_roles')
      .select('salon_id')
      .eq('id', id)
      .single<{ salon_id: string | null }>()

    if (!roleData || (roleData.salon_id && !accessibleSalonIds.includes(roleData.salon_id))) {
      return { error: 'Role not found or unauthorized' }
    }

    // Reactivate role
    const { error } = await supabase
      .schema('identity')
      .from('user_roles')
      .update({
        is_active: true,
        deleted_at: null,
        updated_by_id: session.user.id,
      })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/settings/roles')

    return { success: true }
  } catch {
    return { error: 'Failed to reactivate user role' }
  }
}
