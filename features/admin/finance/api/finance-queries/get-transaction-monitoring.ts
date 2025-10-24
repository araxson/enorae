import 'server-only'

import type { TransactionMetrics } from '@/features/admin/finance/api/types'
import { requireAdminClient } from './client'

export async function getTransactionMonitoring(limit = 100): Promise<TransactionMetrics> {
  const supabase = await requireAdminClient()

  const { data: transactions, error } = await supabase
    .from('manual_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  const transactionData = transactions || []
  const totalTransactions = transactionData.length
  const uniqueSalons = new Set(transactionData.map((t) => t.salon_id).filter(Boolean)).size
  const uniqueCustomers = new Set(transactionData.map((t) => t.customer_id).filter(Boolean)).size

  const paymentMethods = transactionData.reduce((acc, t) => {
    const method = t.payment_method || 'unknown'
    acc[method] = (acc[method] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const transactionTypes = transactionData.reduce((acc, t) => {
    const type = t.transaction_type || 'unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalTransactions,
    uniqueSalons,
    uniqueCustomers,
    paymentMethods,
    transactionTypes,
    recentTransactions: transactionData.slice(0, 10),
  }
}
