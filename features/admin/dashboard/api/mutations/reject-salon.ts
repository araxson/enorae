'use server'

import type { ActionResponse } from '../../api/types'
import { rejectSalon as rejectSalonMutation } from '@/features/admin/salons/api/mutations'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function rejectSalon(formData: FormData): Promise<ActionResponse> {
  const logger = createOperationLogger('rejectSalon', {})
  logger.start()

  const result = await rejectSalonMutation(formData)

  if ('error' in result) {
    return { success: false, error: result.error ?? 'Unknown error' }
  }

  return { success: true, data: undefined }
}
