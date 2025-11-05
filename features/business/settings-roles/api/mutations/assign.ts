'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getAuthorizedContext, userRoleSchema, parsePermissions, type ActionResult } from './helpers'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

/**
 * Assign role to user
 */
export async function assignUserRole(formData: FormData): Promise<ActionResult> {
  const logger = createOperationLogger('assignUserRole', {})
  logger.start()

  try {
    const context = await getAuthorizedContext()

    if (context.error || !context.supabase || !context.session) {
      return { error: context.error || 'Authorization failed' }
    }

    const { session, accessibleSalonIds, supabase } = context

    // Parse and validate input
    const input = {
      user_id: formData.get('userId') as string,
      role: formData.get('role') as string,
      salon_id: formData.get('salonId') as string || undefined,
      permissions: parsePermissions(formData.get('permissions')),
    }

    const validation = userRoleSchema.safeParse(input)

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { error: firstError || 'Validation failed' }
    }

    const validated = validation.data

    // Verify salon access
    if (validated.salon_id && !accessibleSalonIds.includes(validated.salon_id)) {
      return { error: 'Unauthorized to assign roles for this salon' }
    }

    const targetSalonId = validated.salon_id || accessibleSalonIds[0]
    if (!targetSalonId) {
      return { error: 'No salon ID available' }
    }

    if (!accessibleSalonIds.includes(targetSalonId)) {
      return { error: 'Unauthorized to assign roles for this salon' }
    }

    // Check if user already has a role for this salon
    const { data: existingRole } = await supabase
      .schema('identity')
      .from('user_roles')
      .select('id')
      .eq('user_id', validated.user_id)
      .eq('salon_id', targetSalonId)
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
        salon_id: targetSalonId,
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

    revalidatePath('/business/settings/roles', 'page')

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const errors = Object.values(fieldErrors)
      const firstError = errors.length > 0 ? errors[0]?.[0] : undefined
      return { error: firstError || 'Validation failed' }
    }
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to assign user role' }
  }
}
