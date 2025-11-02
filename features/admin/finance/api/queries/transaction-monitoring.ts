import 'server-only'

import type { TransactionMetrics } from '@/features/admin/finance/types'
import { requireAdminClient } from './client'
import { createOperationLogger } from '@/lib/observability/logger'

export async function getTransactionMonitoring(_limit = 100): Promise<TransactionMetrics> {
  const logger = createOperationLogger('getTransactionMonitoring', {})
  logger.start()

  // Manual transactions are not tracked yet
  // The manual_transactions table and query would be added here
  // when the manual transaction recording feature is implemented
  return {
    totalTransactions: 0,
    uniqueSalons: 0,
    uniqueCustomers: 0,
    paymentMethods: {},
    transactionTypes: {},
    recentTransactions: [],
  }
}
