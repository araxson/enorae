'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Grid } from '@/components/layout'
import { H3, H4, P, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

interface Subscription {
  tier: 'basic' | 'professional' | 'enterprise'
  status: 'active' | 'trial' | 'cancelled'
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate: string
  price: number
}

interface UsageQuota {
  name: string
  used: number
  limit: number
  unit: string
}

interface Invoice {
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
  const tierFeatures = {
    basic: ['Up to 5 staff', '200 appointments/month', '100 SMS/month', '2GB storage'],
    professional: ['Up to 25 staff', '1000 appointments/month', '500 SMS/month', '10GB storage', 'Analytics', 'Priority support'],
    enterprise: ['Unlimited staff', 'Unlimited appointments', 'Unlimited SMS', 'Unlimited storage', 'Advanced analytics', 'Dedicated support', 'Custom integrations']
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-gray-100 text-gray-800'
      case 'professional': return 'bg-blue-100 text-blue-800'
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Stack gap="xl">
      {/* Current Subscription */}
      <Card className="p-6">
        <Stack gap="lg">
          <Flex justify="between" align="start">
            <div>
              <H3>Current Subscription</H3>
              <Muted>Manage your plan and billing</Muted>
            </div>
            <Badge className={getTierColor(subscription.tier)}>
              {subscription.tier.toUpperCase()}
            </Badge>
          </Flex>

          <Separator />

          <Grid cols={{ base: 1, md: 2 }} gap="lg">
            <div>
              <Muted className="text-sm mb-2">Plan Details</Muted>
              <Stack gap="sm">
                <Flex justify="between">
                  <span className="text-sm">Tier</span>
                  <span className="font-medium capitalize">{subscription.tier}</span>
                </Flex>
                <Flex justify="between">
                  <span className="text-sm">Billing Cycle</span>
                  <span className="font-medium capitalize">{subscription.billingCycle}</span>
                </Flex>
                <Flex justify="between">
                  <span className="text-sm">Price</span>
                  <span className="font-medium">${subscription.price}/{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </Flex>
                <Flex justify="between">
                  <span className="text-sm">Status</span>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {subscription.status}
                  </Badge>
                </Flex>
              </Stack>
            </div>

            <div>
              <Muted className="text-sm mb-2">Features Included</Muted>
              <ul className="space-y-1.5">
                {tierFeatures[subscription.tier].map((feature, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>

          <Separator />

          <Flex gap="sm">
            <Button variant="outline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Upgrade Plan
            </Button>
            <Button variant="ghost">Change Billing Cycle</Button>
            <Button variant="ghost" className="text-red-600 hover:text-red-700">
              Cancel Subscription
            </Button>
          </Flex>
        </Stack>
      </Card>

      {/* Usage & Quotas */}
      <Card className="p-6">
        <Stack gap="lg">
          <div>
            <H3>Usage & Quotas</H3>
            <Muted>Current usage against your plan limits</Muted>
          </div>

          <Stack gap="md">
            {quotas.map((quota, idx) => {
              const percentage = (quota.used / quota.limit) * 100
              const isNearLimit = percentage >= 80

              return (
                <div key={idx}>
                  <Flex justify="between" className="mb-2">
                    <span className="text-sm font-medium">{quota.name}</span>
                    <span className="text-sm">
                      {quota.used} / {quota.limit} {quota.unit}
                    </span>
                  </Flex>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isNearLimit ? 'bg-red-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {isNearLimit && (
                    <Flex gap="sm" align="center" className="mt-1">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <Muted className="text-xs text-red-600">
                        Approaching limit - consider upgrading
                      </Muted>
                    </Flex>
                  )}
                </div>
              )
            })}
          </Stack>
        </Stack>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <Stack gap="lg">
          <Flex justify="between" align="center">
            <div>
              <H3>Payment Method</H3>
              <Muted>Manage your payment information</Muted>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </Flex>

          <Separator />

          <Flex gap="md" align="center">
            <div className="flex h-12 w-16 items-center justify-center rounded border bg-white">
              <CreditCard className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <P className="font-medium">•••• •••• •••• 4242</P>
              <Muted className="text-sm">Expires 12/2026</Muted>
            </div>
            <Badge variant="outline">Default</Badge>
          </Flex>

          <Separator />

          <Flex gap="sm" align="center" className="text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Muted>
              Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Muted>
          </Flex>
        </Stack>
      </Card>

      {/* Invoice History */}
      <Card className="p-6">
        <Stack gap="lg">
          <div>
            <H3>Invoice History</H3>
            <Muted>Download your past invoices</Muted>
          </div>

          <Separator />

          <Stack gap="sm">
            {invoices.map((invoice) => (
              <Flex key={invoice.id} justify="between" align="center" className="py-2">
                <div className="flex-1">
                  <P className="font-medium">{invoice.id}</P>
                  <Muted className="text-sm">
                    {new Date(invoice.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Muted>
                </div>
                <div className="flex items-center gap-4">
                  <P className="font-medium">${invoice.amount}</P>
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </Flex>
            ))}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}
