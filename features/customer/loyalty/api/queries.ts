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

  // TODO: loyalty_points table not yet in database schema
  return null
}

export async function getLoyaltyTransactions(limit = 50) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: loyalty_transactions table not yet in database schema
  return []
}

export async function calculateLoyaltyValue() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: loyalty_transactions table not yet in database schema
  return {
    total_points: 0,
    points_earned: 0,
    points_redeemed: 0,
    monetary_value: 0,
  }
}