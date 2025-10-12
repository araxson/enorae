import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'

type ManualTransaction = Database['public']['Views']['manual_transactions']['Row']

export type CustomerTransactionWithDetails = ManualTransaction & {
  salon?: {
    id: string
    name: string | null
  } | null
  staff?: {
    id: string
    full_name: string | null
  } | null
  appointment?: {
    id: string
    scheduled_at: string | null
  } | null
}

/**
 * Get all transactions for the current customer
 */
export async function getCustomerTransactions(): Promise<CustomerTransactionWithDetails[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('manual_transactions')
    .select(`
      *,
      salon:salon_id(id, name),
      staff:staff_id(id, full_name),
      appointment:appointment_id(id, scheduled_at)
    `)
    .eq('customer_id', session.user.id)
    .order('transaction_at', { ascending: false })

  if (error) throw error

  return (data || []) as CustomerTransactionWithDetails[]
}

/**
 * Get a specific transaction by ID
 */
export async function getCustomerTransactionById(
  id: string
): Promise<CustomerTransactionWithDetails | null> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('manual_transactions')
    .select(`
      *,
      salon:salon_id(id, name),
      staff:staff_id(id, full_name),
      appointment:appointment_id(id, scheduled_at)
    `)
    .eq('id', id)
    .eq('customer_id', session.user.id)
    .maybeSingle()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data ? (data as CustomerTransactionWithDetails) : null
}