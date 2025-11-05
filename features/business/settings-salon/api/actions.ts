'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { settingsSalonSchema } from './schema'
import { createOperationLogger } from '@/lib/observability'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type FormState = {
  message?: string
  errors?: Record<string, string[]>
  success?: boolean
}

/**
 * Server Action for updating salon business information
 * Includes audit logging for compliance tracking
 */
export async function updateSalonInfoAction(
  salonId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const logger = createOperationLogger('updateSalonInfoAction', { salonId })
  logger.start()

  try {
    // SECURITY: Require business user role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return {
        message: 'Invalid salon ID format',
        success: false,
      }
    }

    const supabase = await createClient()

    // SECURITY: Verify user can access this salon
    if (!(await canAccessSalon(salonId))) {
      return {
        message: 'Unauthorized: You do not have access to this salon',
        success: false,
      }
    }

    // Parse and validate form data
    const businessNameValue = formData.get('business_name')
    const businessTypeValue = formData.get('business_type')
    const establishedAtValue = formData.get('established_at')

    const parsed = settingsSalonSchema.safeParse({
      business_name: typeof businessNameValue === 'string' ? businessNameValue : undefined,
      business_type: typeof businessTypeValue === 'string' ? businessTypeValue : undefined,
      established_at: typeof establishedAtValue === 'string'
        ? new Date(establishedAtValue)
        : undefined,
    })

    if (!parsed.success) {
      return {
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
        success: false,
      }
    }

    // Get old data for audit logging
    const { data: oldData } = await supabase
      .schema('organization')
      .from('salons')
      .select('business_name, business_type, established_at')
      .eq('id', salonId)
      .single()

    // Prepare update data
    const updateData: Record<string, unknown> = {
      business_name: parsed.data.business_name,
      updated_at: new Date().toISOString(),
      updated_by_id: session.user.id,
    }

    if (parsed.data.business_type) {
      updateData['business_type'] = parsed.data.business_type
    }

    if (parsed.data.established_at) {
      updateData['established_at'] = parsed.data.established_at.toISOString().split('T')[0]
    }

    // Update salon information
    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update(updateData)
      .eq('id', salonId)

    if (error) throw error

    // AUDIT LOG: Track business information changes
    if (oldData) {
      const changes: Record<string, { old: unknown; new: unknown }> = {}

      if (oldData['business_name'] !== updateData['business_name']) {
        changes['business_name'] = {
          old: oldData['business_name'],
          new: updateData['business_name'],
        }
      }
      if (oldData['business_type'] !== updateData['business_type']) {
        changes['business_type'] = {
          old: oldData['business_type'],
          new: updateData['business_type'],
        }
      }
      if (oldData['established_at'] !== updateData['established_at']) {
        changes['established_at'] = {
          old: oldData['established_at'],
          new: updateData['established_at'],
        }
      }

      if (Object.keys(changes).length > 0) {
        await supabase
          .schema('organization')
          .from('audit_logs')
          .insert({
            user_id: session.user.id,
            action: 'salon.update_business_info',
            resource_type: 'salon',
            resource_id: salonId,
            changes: changes as unknown as Record<string, never>,
            created_at: new Date().toISOString(),
          })
      }
    }

    revalidatePath('/business/settings/salon', 'page')
    revalidatePath('/business/dashboard', 'layout')

    logger.success({ message: 'Business information updated successfully' })

    return {
      message: 'Business information updated successfully',
      success: true,
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')

    if (error instanceof z.ZodError) {
      return {
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
        success: false,
      }
    }

    return {
      message: error instanceof Error ? error.message : 'Failed to update salon information',
      success: false,
    }
  }
}
