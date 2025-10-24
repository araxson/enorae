import 'server-only'
import { createClient } from '@/lib/supabase/server'

export interface Referral {
  id: string
  code: string
  referred_user_id: string | null
  bonus_points: number
  status: 'pending' | 'completed'
  created_at: string
  used_at: string | null
}

export async function getReferralCode() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: referrals table not yet in database schema
  return null
}

export async function getReferralStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: referrals table not yet in database schema
  return {
    total_referrals: 0,
    successful_referrals: 0,
    pending_referrals: 0,
    total_bonus_points: 0,
  }
}

export async function getReferralHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: referrals table not yet in database schema
  return []
}