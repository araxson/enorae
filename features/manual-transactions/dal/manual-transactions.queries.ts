import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: manual_transactions doesn't have public view yet

type ManualTransaction = Database['public']['Views']['manual_transactions']['Row']

export type ManualTransactionWithDetails = ManualTransaction & {
  created_by?: {
    id: string
    full_name: string | null
  } | null
}

/**
 * Get manual transactions for the user's salon
 */
export async function getManualTransactions(limit = 100): Promise<ManualTransactionWithDetails[]> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error} = await supabase
    .from('manual_transactions')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .order('transaction_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  // Get created_by for each transaction
  const transactionsWithDetails = await Promise.all(
    (data || []).map(async (transaction) => {
      let createdBy = null
      if (transaction.created_by_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', transaction.created_by_id)
          .single()
        createdBy = profile
      }

      return {
        ...transaction,
        created_by: createdBy,
      }
    })
  )

  return transactionsWithDetails
}

/**
 * Get manual transaction by ID
 */
export async function getManualTransactionById(
  id: string
): Promise<ManualTransactionWithDetails | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('manual_transactions')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .single()

  if (error) throw error

  let createdBy = null
  if (data.created_by_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', data.created_by_id)
      .single()
    createdBy = profile
  }

  return {
    ...data,
    created_by: createdBy,
  }
}
