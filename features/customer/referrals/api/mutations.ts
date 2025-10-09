'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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
  return { success: true, code: data as string }
}

export async function shareReferralCode(platform: 'email' | 'sms' | 'copy', code: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Log share activity
  const { error } = await supabase
    .schema('engagement')
    .from('referral_shares')
    .insert({
      referrer_id: user.id,
      referral_code: code,
      platform,
      shared_at: new Date().toISOString(),
    })

  if (error) throw error

  revalidatePath('/customer/referrals')
  return { success: true }
}
