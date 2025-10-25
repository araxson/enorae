import 'server-only'

import type { TransactionMetrics } from '@/features/admin/finance/api/types'
import { requireAdminClient } from './client'

export async function getTransactionMonitoring(_limit = 100): Promise<TransactionMetrics> {
  // Manual transactions feature not implemented - return empty metrics
  // TODO: Implement manual_transactions table and query
  return {
    totalTransactions: 0,
    uniqueSalons: 0,
    uniqueCustomers: 0,
    paymentMethods: {},
    transactionTypes: {},
    recentTransactions: [],
  }
}
