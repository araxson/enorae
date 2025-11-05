'use server'

import { toast } from 'sonner'
import {
  acknowledgeSecurityAlert,
  dismissSecurityAlert,
  suppressSecurityAlert,
} from '@/features/admin/security-access-monitoring/api/mutations'

/**
 * Handle acknowledge action
 */
export async function handleAcknowledge(accessId: string): Promise<{ success: string } | { error: string }> {
  const formData = new FormData()
  formData.append('accessId', accessId)
  const result = await acknowledgeSecurityAlert(formData)

  if ('error' in result) {
    return { error: result.error }
  }

  return { success: 'Alert acknowledged' }
}

/**
 * Handle dismiss action
 */
export async function handleDismiss(accessId: string): Promise<{ success: string } | { error: string }> {
  const formData = new FormData()
  formData.append('accessId', accessId)
  const result = await dismissSecurityAlert(formData)

  if ('error' in result) {
    return { error: result.error }
  }

  return { success: 'Alert dismissed' }
}

/**
 * Handle suppress action
 */
export async function handleSuppress(
  accessId: string,
  reason: string,
  duration: '1hour' | '1day' | '1week' | 'permanent'
): Promise<{ success: string } | { error: string }> {
  const formData = new FormData()
  formData.append('accessId', accessId)
  formData.append('reason', reason)
  formData.append('duration', duration)
  const result = await suppressSecurityAlert(formData)

  if ('error' in result) {
    return { error: result.error }
  }

  return { success: 'Alert suppressed' }
}
