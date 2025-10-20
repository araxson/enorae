'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getSalonContext, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'
import { userRoleSchema, type ActionResult } from './schemas'
import type { Database } from '@/lib/types/database.types'

/**
 * Assign role to user
 */
export async function assignUserRole(formData: FormData): Promise<ActionResult> {
  try {
    // SECURITY: Require business role
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) throw authError
    if (!user) return { error: 'Unauthorized' }

    // Check if user already has a role for this salon
    const { data: existingRole } = await supabase
      .schema('identity')
      .from('user_roles')
      .select('id')
      .eq('user_id', validated.user_id)
      .eq('salon_id', validated.salon_id || accessibleSalonIds[0])
      .single()

    if (existingRole) {
      return { error: 'User already has a role for this salon' }
    }

    // Assign role
    const payload: Database['identity']['Tables']['user_roles']['Insert'] = {
      user_id: validated.user_id,
      role: validated.role as Database['public']['Enums']['role_type'],
      salon_id: validated.salon_id || accessibleSalonIds[0],
      permissions: validated.permissions ?? [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by_id: user.id,
      updated_by_id: user.id,
    }

    const { data, error } = await supabase
      .schema('identity')
      .from('user_roles')
      .insert(payload)
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
