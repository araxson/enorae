'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function bulkUpdateTransactionStatus(data: {
  transactionIds: string[]
  status: string
  reason?: string
}) {
  const logger = createOperationLogger('bulkUpdateTransactionStatus', {})
  logger.start()
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  throw new Error('bulkUpdateTransactionStatus is not implemented for the Admin Portal yet.')
}
