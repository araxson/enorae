'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function flagTransaction(data: {
  transactionId: string
  reason: string
  priority: 'low' | 'medium' | 'high'
}) {
  const logger = createOperationLogger('flagTransaction', {})
  logger.start()
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  throw new Error('flagTransaction is not implemented for the Admin Portal yet.')
}
