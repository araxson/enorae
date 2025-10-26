import 'server-only'

import type { ManualTransactionRow, PaymentMethodStats } from '@/features/admin/finance/types'
import { requireAdminClient } from './client'

export async function getPaymentMethodStats(
  _startDate?: string,
  _endDate?: string,
): Promise<PaymentMethodStats[]> {
  // Manual transactions feature not implemented - return empty array
  // TODO: Implement manual_transactions table and query
  return []
}
