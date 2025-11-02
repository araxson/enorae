'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createOperationLogger } from '@/lib/observability/logger'
import {
  requireAnyRole,
  setActiveSalonId,
  ROLE_GROUPS,
} from '@/lib/auth'
import { UUID_REGEX } from '@/lib/validations/shared'

const setActiveSalonSchema = z.object({
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID format'),
})

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function setActiveSalon(formData: FormData): Promise<ActionResponse> {
  const logger = createOperationLogger('setActiveSalon', {})
  logger.start()

  try {
    const salonId = formData.get('salonId')
    if (typeof salonId !== 'string' || salonId.length === 0) {
      return { success: false, error: 'Salon ID is required' }
    }

    // Validate input with Zod
    const validation = setActiveSalonSchema.safeParse({ salonId })
    if (!validation.success) {
      const error = validation.error.issues[0]?.message ?? 'Invalid salon ID'
      logger.error(error, 'validation')
      return { success: false, error }
    }

    // Verify user has business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Set active salon
    await setActiveSalonId(salonId)

    // Revalidate relevant paths
    revalidatePath('/business', 'page')
    revalidatePath('/staff', 'page')

    logger.success({ salonId, userId: session.user.id })
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set active salon',
    }
  }
}
