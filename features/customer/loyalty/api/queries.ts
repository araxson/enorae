import 'server-only'
import { createClient } from '@/lib/supabase/server'

export interface LoyaltyPoints {
  total_points: number
  points_earned: number
  points_redeemed: number
  tier: string
  next_tier_points: number
}

export interface LoyaltyTransaction {
  id: string
  points: number
  type: 'earned' | 'redeemed'
  description: string
  appointment_id: string | null
  created_at: string
}

export async function getLoyaltyPoints() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('engagement')
    .from('loyalty_points')
    .select('*')
    .eq('customer_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error

  return data as LoyaltyPoints | null
}

export async function getLoyaltyTransactions(limit = 50) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('engagement')
    .from('loyalty_transactions')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  const rows = (data ?? []) as Array<Partial<LoyaltyTransaction>>

  return rows
    .filter((row): row is LoyaltyTransaction => Boolean(row.id && row.points !== undefined && row.type && row.description && row.created_at))
    .map((row) => ({
      id: row.id,
      points: row.points,
      type: row.type,
      description: row.description,
      appointment_id: row.appointment_id ?? null,
      created_at: row.created_at,
    }))
}

export async function calculateLoyaltyValue() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_loyalty_value', {
      p_customer_id: user.id,
    })

  if (error) throw error
  return data
}