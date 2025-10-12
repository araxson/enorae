'use client'

import { Stack } from '@/components/layout'
import { SubscriptionOverviewCard } from './subscription-overview-card'
import { UsageQuotaCard } from './usage-quota-card'
import { PaymentMethodCard } from './payment-method-card'
import { InvoiceHistoryCard } from './invoice-history-card'

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

interface BillingSubscriptionFormProps {
  subscription?: Subscription
  quotas?: UsageQuota[]
  invoices?: Invoice[]
}

export function BillingSubscriptionForm({
  subscription = {
    tier: 'professional',
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: '2025-11-09',
    price: 99
  },
  quotas = [
    { name: 'Active Staff', used: 12, limit: 25, unit: 'users' },
    { name: 'Monthly Appointments', used: 450, limit: 1000, unit: 'bookings' },
    { name: 'SMS Notifications', used: 320, limit: 500, unit: 'messages' },
    { name: 'Storage', used: 2.4, limit: 10, unit: 'GB' }
  ],
  invoices = [
    { id: 'INV-2025-10', date: '2025-10-09', amount: 99, status: 'paid' },
    { id: 'INV-2025-09', date: '2025-09-09', amount: 99, status: 'paid' },
    { id: 'INV-2025-08', date: '2025-08-09', amount: 99, status: 'paid' }
  ]
}: BillingSubscriptionFormProps) {
  return (
    <Stack gap="xl">
      <SubscriptionOverviewCard subscription={subscription} />
      <UsageQuotaCard quotas={quotas} />
      <PaymentMethodCard subscription={subscription} />
      <InvoiceHistoryCard invoices={invoices} />
    </Stack>
  )
}
