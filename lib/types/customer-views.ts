import type { Database } from './database.types'

export type CustomerLoyaltyPointsRow = {
  customer_id: string
  total_points: number
  points_earned: number
  points_redeemed: number
  tier: string | null
  next_tier_points: number
  created_at: string | null
  created_by_id: string | null
  updated_at: string | null
  updated_by_id: string | null
}

export type CustomerLoyaltyTransactionRow = {
  id: string
  customer_id: string
  points: number
  type: 'earned' | 'redeemed'
  description: string | null
  appointment_id: string | null
  created_at: string
  created_by_id: string | null
  updated_at: string | null
  updated_by_id: string | null
}

export type CustomerReferralRow = {
  id: string
  referrer_id: string
  code: string
  referred_user_id: string | null
  bonus_points: number
  status: 'pending' | 'completed'
  created_at: string
  used_at: string | null
}

type CustomerViewExtensions = {
  customer_loyalty_points: {
    Row: CustomerLoyaltyPointsRow
  }
  customer_loyalty_transactions: {
    Row: CustomerLoyaltyTransactionRow
  }
  customer_referrals: {
    Row: CustomerReferralRow
  }
}

export type CustomerDatabase = Database & {
  public: Database['public'] & {
    Views: Database['public']['Views'] & CustomerViewExtensions
  }
}
