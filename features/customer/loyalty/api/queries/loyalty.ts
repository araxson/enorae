import 'server-only'
import { requireAuth } from '@/lib/auth'

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
  await requireAuth()
  // Loyalty program is not available yet (schema absent)
  return null
}

export async function getLoyaltyTransactions(limit = 50) {
  await requireAuth()
  // Loyalty program is not available yet (schema absent)
  return []
}

export async function calculateLoyaltyValue() {
  await requireAuth()
  // Loyalty program is not available yet (schema absent)
  return {
    total_points: 0,
    points_earned: 0,
    points_redeemed: 0,
    monetary_value: 0,
  }
}
