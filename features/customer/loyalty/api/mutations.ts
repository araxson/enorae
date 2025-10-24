'use server'

import { createClient } from '@/lib/supabase/server'

export async function redeemLoyaltyPoints(points: number, rewardId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: loyalty_transactions table not yet in database schema
  throw new Error('Loyalty points feature not yet implemented')
}

export async function generateReferralCode() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: referrals table not yet in database schema
  throw new Error('Referral codes feature not yet implemented')
}

export async function trackReferralUse(referralCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: referrals table not yet in database schema
  throw new Error('Referral tracking feature not yet implemented')
}
