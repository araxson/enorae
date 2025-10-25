'use server'

import { requireAuth } from '@/lib/auth'

export async function redeemLoyaltyPoints(points: number, rewardId?: string) {
  await requireAuth()

  throw new Error('Loyalty program is not available yet')
}

export async function generateReferralCode() {
  await requireAuth()

  throw new Error('Loyalty program is not available yet')
}

export async function trackReferralUse(referralCode: string) {
  await requireAuth()

  throw new Error('Loyalty program is not available yet')
}
