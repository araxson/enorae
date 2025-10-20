import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, TrendingUp } from 'lucide-react'
import type { Subscription } from './billing-subscription-form'

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

function getTierColor(tier: Subscription['tier']) {
  switch (tier) {
    case 'basic':
      return 'bg-secondary text-secondary-foreground'
    case 'professional':
      return 'bg-info/10 text-info'
    case 'enterprise':
      return 'bg-primary/10 text-primary'
    default:
      return 'bg-secondary text-secondary-foreground'
  }
}

export function SubscriptionOverviewCard({
  subscription,
}: {
  subscription: Subscription
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Current Subscription</h3>
            <p className="text-sm text-muted-foreground">Manage your plan and billing</p>
          </div>
          <Badge className={getTierColor(subscription.tier)}>
            {subscription.tier.toUpperCase()}
          </Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Plan Details</p>
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
            <p className="text-sm text-muted-foreground mb-2">Features Included</p>
            <ul className="space-y-1.5">
              {tierFeatures[subscription.tier].map((feature) => (
                <li key={feature} className="flex gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Upgrade Plan
          </Button>
          <Button variant="ghost">Change Billing Cycle</Button>
          <Button variant="destructive">
            Cancel Subscription
          </Button>
        </div>
      </div>
    </Card>
  )
}
