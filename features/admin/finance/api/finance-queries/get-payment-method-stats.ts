import 'server-only'

import type { ManualTransactionRow, PaymentMethodStats } from '@/features/admin/finance/api/types'
import { requireAdminClient } from './client'

export async function getPaymentMethodStats(
  startDate?: string,
  endDate?: string,
): Promise<PaymentMethodStats[]> {
  const supabase = await requireAdminClient()

  let query = supabase
    .from('manual_transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (startDate) {
    query = query.gte('created_at', startDate)
  }

  if (endDate) {
    query = query.lte('created_at', endDate)
  }

  const { data: transactions, error } = await query
  if (error) throw error

  const methodMap = new Map<string, { count: number; transactions: ManualTransactionRow[] }>()

  transactions?.forEach((transaction) => {
    const method = transaction.payment_method || 'unknown'
    if (!methodMap.has(method)) {
      methodMap.set(method, { count: 0, transactions: [] })
    }
    const stats = methodMap.get(method)!
    stats.count += 1
    stats.transactions.push(transaction)
  })

  const totalTransactions = transactions?.length || 1

  return Array.from(methodMap.entries())
    .map(([method, data]) => ({
      method,
      count: data.count,
      percentage: (data.count / totalTransactions) * 100,
      lastUsed: data.transactions[0]?.created_at || null,
    }))
    .sort((a, b) => b.count - a.count)
}
