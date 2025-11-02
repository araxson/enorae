'use server'

import { requireAuth } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function generateReferralCode(): Promise<{
  success: boolean; code?: string
}> {
  const logger = createOperationLogger('generateReferralCode', {})
  logger.start()
  await requireAuth()

  throw new Error('Referral program is not available yet')
}

export async function shareReferralCode(platform: 'email' | 'sms' | 'copy', code: string) {
  await requireAuth()

  throw new Error('Referral program is not available yet')
}
