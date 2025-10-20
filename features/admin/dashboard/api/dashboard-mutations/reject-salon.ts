'use server'

import type { ActionResponse } from './types'
import { rejectSalon as rejectSalonMutation } from '@/features/admin/salons/api/mutations/reject-salon.mutation'

export async function rejectSalon(formData: FormData): Promise<ActionResponse> {
  const result = await rejectSalonMutation(formData)

  if ('error' in result) {
    return { success: false, error: result.error ?? 'Unknown error' }
  }

  return { success: true, data: undefined }
}
