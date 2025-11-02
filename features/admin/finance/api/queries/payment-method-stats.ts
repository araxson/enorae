import 'server-only'

import type { ManualTransactionRow, PaymentMethodStats } from '@/features/admin/finance/types'
import { requireAdminClient } from './client'
import { createOperationLogger } from '@/lib/observability/logger'

export async function getPaymentMethodStats(
  _startDate?: string,
  _endDate?: string,
): Promise<PaymentMethodStats[]> {
  const logger = createOperationLogger('getPaymentMethodStats', {})
  logger.start()

  // Manual transactions are not tracked yet
  // The manual_transactions table and query would be added here
  // when the manual transaction recording feature is implemented
  return []
}
