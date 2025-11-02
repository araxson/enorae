'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function exportFinancialDataToCSV(data: {
  startDate: string
  endDate: string
  includeTransactions: boolean
  includeRevenueSummary: boolean
}) {
  const logger = createOperationLogger('exportFinancialDataToCSV', {})
  logger.start()
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  throw new Error('exportFinancialDataToCSV is not implemented for the Admin Portal yet.')
}
