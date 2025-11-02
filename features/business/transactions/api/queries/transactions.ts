import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getSalonContext, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

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
  const logger = createOperationLogger('getManualTransactions', {})
  logger.start()

  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length) throw new Error('User salon not found')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('manual_transactions_view')
    .select('*')
    .in('salon_id', accessibleSalonIds)
    .order('transaction_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  // Fetch related profile details separately
  const transactions = (data || []) as ManualTransactionWithDetails[]

  // Collect all unique IDs for batch fetching
  const staffIds = [...new Set(transactions.map((t) => t.staff_id).filter((id): id is string => typeof id === 'string'))]
  const customerIds = [...new Set(transactions.map((t) => t.customer_id).filter((id): id is string => typeof id === 'string'))]
  const createdByIds = [...new Set(transactions.map((t) => t.created_by_id).filter((id): id is string => typeof id === 'string'))]

  // Fetch staff details
  let staffMap = new Map<string, { id: string; full_name: string | null }>()
  if (staffIds.length > 0) {
    const { data: staffData } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('id, user_id')
      .in('id', staffIds)
    if (staffData) {
      // Get profiles for staff
      const userIds = staffData
        .map((s) => s.user_id)
        .filter((id): id is string => typeof id === 'string')
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles_view')
          .select('id, full_name')
          .in('id', userIds)
        const profileMap = new Map<string, string | null>()
        if (profiles) {
          profiles.forEach((p) => {
            if (p.id) {
              profileMap.set(p.id, p.full_name)
            }
          })
        }
        staffData.forEach((s) => {
          if (s.id && s.user_id) {
            staffMap.set(s.id, { id: s.id, full_name: profileMap.get(s.user_id) || null })
          }
        })
      }
    }
  }

  // Fetch customer details
  let customerMap = new Map<string, { id: string; full_name: string | null; email: string | null }>()
  if (customerIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles_view')
      .select('id, email, full_name')
      .in('id', customerIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
    }

    if (profiles && Array.isArray(profiles)) {
      profiles.forEach((c) => {
        if (c.id) {
          customerMap.set(c.id, {
            id: c.id,
            full_name: c.full_name || null,
            email: c.email || null
          })
        }
      })
    }
  }

  // Fetch created_by details
  let createdByMap = new Map<string, { id: string; full_name: string | null }>()
  if (createdByIds.length > 0) {
    const { data: createdByMetadata } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .select('profile_id, full_name')
      .in('profile_id', createdByIds)
    if (createdByMetadata) {
      createdByMetadata.forEach((u) => {
        if (u.profile_id) {
          createdByMap.set(u.profile_id, { id: u.profile_id, full_name: u.full_name })
        }
      })
    }
  }

  // Enrich transactions with related data
  return transactions.map((t) => ({
    ...t,
    staff: t.staff_id ? staffMap.get(t.staff_id) || null : null,
    customer: t.customer_id ? customerMap.get(t.customer_id) || null : null,
    created_by: t.created_by_id ? createdByMap.get(t.created_by_id) || null : null,
  }))
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

  const { data, error } = await supabase
    .from('manual_transactions_view')
    .select('*')
    .eq('id', id)
    .in('salon_id', accessibleSalonIds)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  if (!data || typeof data !== 'object') return null

  // Fetch related details
  const transaction = data as ManualTransactionWithDetails

  // Fetch staff
  let staff = null
  if (transaction.staff_id) {
    const { data: staffData } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('id, user_id')
      .eq('id', transaction.staff_id)
      .single()
    if (staffData && staffData.user_id) {
      const { data: profileMetadata } = await supabase
        .schema('identity')
        .from('profiles_metadata')
        .select('profile_id, full_name')
        .eq('profile_id', staffData.user_id)
        .single()
      staff = profileMetadata ? { id: staffData.id, full_name: profileMetadata.full_name } : null
    }
  }

  // Fetch customer
  let customer: { id: string; full_name: string | null; email: string | null } | null = null
  if (transaction.customer_id) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles_view')
      .select('id, email, full_name')
      .eq('id', transaction.customer_id)
      .single()
    if (!profileError && profileData && profileData.id) {
      customer = {
        id: profileData.id,
        full_name: profileData.full_name || null,
        email: profileData.email || null
      }
    }
  }

  // Fetch created_by
  let created_by = null
  if (transaction.created_by_id) {
    const { data: metadataData } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .select('profile_id, full_name')
      .eq('profile_id', transaction.created_by_id)
      .single()
    if (metadataData) {
      created_by = { id: metadataData.profile_id, full_name: metadataData.full_name }
    }
  }

  return {
    ...transaction,
    staff,
    customer,
    created_by,
  }
}
