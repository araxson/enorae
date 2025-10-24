'use server'

import { createClient } from '@/lib/supabase/server'

export async function generateReferralCode(): Promise<{ success: boolean; code?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: referrals table not yet in database schema
  throw new Error('Referral codes feature not yet implemented')
}

export async function shareReferralCode(platform: 'email' | 'sms' | 'copy', code: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: referral_shares table not yet in database schema
  throw new Error('Referral sharing feature not yet implemented')
}
