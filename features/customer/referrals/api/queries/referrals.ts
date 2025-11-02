import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

export interface Referral {
  id: string
  code: string
  referred_user_id: string | null
  bonus_points: number
  status: 'pending' | 'completed'
  created_at: string
  used_at: string | null
}

export async function getReferralCode(): Promise<string | null> {
  const logger = createOperationLogger('getReferralCode', {})
  logger.start()

  await requireAuth()
  // Referral program is not available yet (schema absent)
  return null
}

export interface ReferralStats {
  total_referrals: number
  successful_referrals: number
  pending_referrals: number
  total_bonus_points: number
}

export async function getReferralStats(): Promise<ReferralStats> {
  await requireAuth()
  // Referral program is not available yet (schema absent)
  return {
    total_referrals: 0,
    successful_referrals: 0,
    pending_referrals: 0,
    total_bonus_points: 0,
  }
}

export async function getReferralHistory(): Promise<Referral[]> {
  await requireAuth()
  // Referral program is not available yet (schema absent)
  return []
}
