import 'server-only'
import { requireAuth } from '@/lib/auth'

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
  await requireAuth()
  // Referral program is not available yet (schema absent)
  return null
}

export async function getReferralStats() {
  await requireAuth()
  // Referral program is not available yet (schema absent)
  return {
    total_referrals: 0,
    successful_referrals: 0,
    pending_referrals: 0,
    total_bonus_points: 0,
  }
}

export async function getReferralHistory() {
  await requireAuth()
  // Referral program is not available yet (schema absent)
  return []
}
