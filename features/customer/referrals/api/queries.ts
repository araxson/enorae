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

  const { data, error } = await supabase
    .schema('engagement')
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as Referral | null
}

export async function getReferralStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('engagement')
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id)

  if (error) throw error

  const stats = {
    total_referrals: data.length,
    successful_referrals: data.filter(r => r.status === 'completed').length,
    pending_referrals: data.filter(r => r.status === 'pending').length,
    total_bonus_points: data.reduce((sum, r) => sum + (r.bonus_points || 0), 0),
  }

  return stats
}

export async function getReferralHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('engagement')
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data as Referral[]
}