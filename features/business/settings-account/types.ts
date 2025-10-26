export interface SettingsAccountState {}

export interface SettingsAccountParams {}

// Shared types for billing and subscription components
export interface Subscription {
  tier: 'basic' | 'professional' | 'enterprise'
  status: 'active' | 'trial' | 'cancelled'
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate: string
  price: number
}

export interface UsageQuota {
  name: string
  used: number
  limit: number
  unit: string
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  downloadUrl?: string
}
