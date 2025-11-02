import { CheckCircle2, TrendingUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import type { Subscription } from '../types'

const tierFeatures: Record<Subscription['tier'], string[]> = {
  basic: [
    'Up to 5 staff',
    '200 appointments/month',
    '100 SMS/month',
    '2GB storage',
  ],
  professional: [
    'Up to 25 staff',
    '1000 appointments/month',
    '500 SMS/month',
    '10GB storage',
    'Analytics',
    'Priority support',
  ],
  enterprise: [
    'Unlimited staff',
    'Unlimited appointments',
    'Unlimited SMS',
    'Unlimited storage',
    'Advanced analytics',
    'Dedicated support',
    'Custom integrations',
  ],
}

export function SubscriptionOverviewCard({
  subscription,
}: {
  subscription: Subscription
}) {
  const tierVariant =
    subscription.tier === 'enterprise'
      ? 'default'
      : subscription.tier === 'professional'
        ? 'secondary'
        : 'outline'

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader className="flex items-start justify-between">
        <div>
          <ItemTitle>Current Subscription</ItemTitle>
          <ItemDescription>Manage your plan and billing</ItemDescription>
        </div>
        <Badge variant={tierVariant}>{subscription.tier.toUpperCase()}</Badge>
      </ItemHeader>
      <ItemContent className="flex flex-col gap-8">
        <Separator />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <ItemDescription>Plan Details</ItemDescription>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tier</span>
                <span className="font-medium capitalize">
                  {subscription.tier}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Billing Cycle</span>
                <span className="font-medium capitalize">
                  {subscription.billingCycle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Price</span>
                <span className="font-medium">
                  ${subscription.price}/
                  {subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge
                  variant={subscription.status === 'active' ? 'default' : 'secondary'}
                >
                  {subscription.status}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <ItemDescription>Features Included</ItemDescription>
            <ul className="space-y-1.5">
              {tierFeatures[subscription.tier].map((feature) => (
                <li key={feature} className="flex gap-2 text-sm">
                  <CheckCircle2 className="size-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        <ButtonGroup>
          <Button variant="outline" className="gap-2">
            <TrendingUp className="size-4" />
            Upgrade Plan
          </Button>
          <Button variant="ghost">Change Billing Cycle</Button>
          <Button variant="destructive">
            Cancel Subscription
          </Button>
        </ButtonGroup>
      </ItemContent>
    </Item>
  )
}
