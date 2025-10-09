'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function redeemLoyaltyPoints(points: number, rewardId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('engagement')
    .from('loyalty_transactions')
    .insert({
      customer_id: user.id,
      points: -points,
      type: 'redeemed',
      description: rewardId ? `Redeemed for reward ${rewardId}` : 'Points redeemed',
      created_at: new Date().toISOString(),
    })

  if (error) throw error

  revalidatePath('/customer/loyalty')
  return { success: true }
}

export async function generateReferralCode() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('generate_referral_code', {
      p_user_id: user.id,
    })

  if (error) throw error

  revalidatePath('/customer/referrals')
  return { success: true, code: data }
}

export async function trackReferralUse(referralCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('engagement')
    .from('referrals')
    .update({
      used_at: new Date().toISOString(),
      referred_user_id: user.id,
    })
    .eq('code', referralCode)
    .is('used_at', null)

  if (error) throw error

  revalidatePath('/customer/referrals')
  return { success: true }
}
