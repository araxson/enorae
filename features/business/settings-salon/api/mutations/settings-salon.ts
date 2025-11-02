'use server'

import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const salonInfoSchema = z.object({
  business_name: z.string().min(1).max(200).optional(),
  business_type: z.string().max(100).optional(),
  established_at: z.string().optional(), // Date string in YYYY-MM-DD format
})

export async function updateSalonInfo(salonId: string, formData: FormData) {
  const logger = createOperationLogger('updateSalonInfo', {})
  logger.start()

  try {
    // SECURITY: Require business user role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Validate input
    const validated = salonInfoSchema.parse({
      business_name: formData.get('business_name') || undefined,
      business_type: formData.get('business_type') || undefined,
      established_at: formData.get('established_at') || undefined,
    })

    // Update salon info
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      updated_by_id: session.user['id'],
    }

    if (validated['business_name']) {
      updateData['business_name'] = validated['business_name']
    }
    if (validated['business_type']) {
      updateData['business_type'] = validated['business_type']
    }
    if (validated['established_at']) {
      updateData['established_at'] = validated['established_at']
    }

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update(updateData)
      .eq('id', salonId)

    if (error) throw error

    revalidatePath('/business/settings/salon', 'page')
    revalidatePath('/business/dashboard', 'layout')

    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed: ' + error.issues[0]?.message }
    }
    return { error: 'Failed to update salon information' }
  }
}
