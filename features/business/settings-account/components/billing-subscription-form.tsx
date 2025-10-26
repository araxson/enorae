'use client'
import { SubscriptionOverviewCard } from './subscription-overview-card'
import { UsageQuotaCard } from './usage-quota-card'
import { PaymentMethodCard } from './payment-method-card'
import { InvoiceHistoryCard } from './invoice-history-card'
import type { Subscription, UsageQuota, Invoice } from '../types'

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
    <div className="flex flex-col gap-8">
      <SubscriptionOverviewCard subscription={subscription} />
      <UsageQuotaCard quotas={quotas} />
      <PaymentMethodCard subscription={subscription} />
      <InvoiceHistoryCard invoices={invoices} />
    </div>
  )
}
