'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function exportFinancialDataToCSV(data: {
  startDate: string
  endDate: string
  includeTransactions: boolean
  includeRevenueSummary: boolean
}) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  throw new Error('exportFinancialDataToCSV is not implemented for the Admin Portal yet.')
}
