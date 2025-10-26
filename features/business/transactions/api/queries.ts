import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getSalonContext, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type ManualTransaction = Database['public']['Views']['manual_transactions_view']['Row']

export type ManualTransactionWithDetails = ManualTransaction & {
  created_by?: {
    id: string
    full_name: string | null
  } | null
  staff?: {
    id: string
    full_name: string | null
  } | null
  customer?: {
    id: string
    full_name: string | null
    email: string | null
  } | null
}

/**
 * Get manual transactions for the user's salon
 */
export async function getManualTransactions(limit = 100): Promise<ManualTransactionWithDetails[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length) throw new Error('User salon not found')

  const supabase = await createClient()

  // PERFORMANCE: Use join syntax to eliminate N+1 queries (300+ → 1 query)
  const { data, error } = await supabase
    .from('manual_transactions_view')
    .select(`
      *,
      created_by:created_by_id(id, full_name),
      staff:staff_id(id, full_name),
      customer:customer_id(id, full_name, email)
    `)
    .in('salon_id', accessibleSalonIds)
    .order('transaction_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  // Filter out error objects and ensure proper typing
  const transactions = data || []
  return transactions.filter((item: unknown): item is ManualTransactionWithDetails =>
    item !== null && typeof item === 'object' && !('error' in item)
  )
}

/**
 * Get manual transaction by ID
 * IMPROVED: Uses nested SELECT consistently (matches getManualTransactions pattern)
 */
export async function getManualTransactionById(
  id: string
): Promise<ManualTransactionWithDetails | null> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length) throw new Error('User salon not found')

  const supabase = await createClient()

  // ✅ FIXED: Single query with nested SELECT for all relations (consistent with getManualTransactions)
  const { data, error } = await supabase
    .from('manual_transactions_view')
    .select(`
      *,
      created_by:created_by_id(id, full_name),
      staff:staff_id(id, full_name),
      customer:customer_id(id, full_name, email)
    `)
    .eq('id', id)
    .in('salon_id', accessibleSalonIds)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Type guard to ensure data matches expected shape
  if (!data || typeof data !== 'object') return null
  return data as ManualTransactionWithDetails
}
