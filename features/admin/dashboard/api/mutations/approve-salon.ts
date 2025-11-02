'use server'

import type { ActionResponse } from '../../types'
import { approveSalon as approveSalonMutation } from '@/features/admin/salons/api/mutations/approve-salon'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function approveSalon(formData: FormData): Promise<ActionResponse> {
  const logger = createOperationLogger('approveSalon', {})
  logger.start()

  const result = await approveSalonMutation(formData)

  if ('error' in result) {
    return { success: false, error: result.error ?? 'Unknown error' }
  }

  return { success: true, data: undefined }
}
