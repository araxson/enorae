import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Grid } from '@/components/layout'
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
      return 'bg-gray-100 text-gray-800'
    case 'professional':
      return 'bg-blue-100 text-blue-800'
    case 'enterprise':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function SubscriptionOverviewCard({
  subscription,
}: {
  subscription: Subscription
}) {
  return (
    <Card className="p-6">
      <Stack gap="lg">
        <Flex justify="between" align="start">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Current Subscription</h3>
            <p className="text-sm text-muted-foreground">Manage your plan and billing</p>
          </div>
          <Badge className={getTierColor(subscription.tier)}>
            {subscription.tier.toUpperCase()}
          </Badge>
        </Flex>

        <Separator />

        <Grid cols={{ base: 1, md: 2 }} gap="lg">
          <div>
            <p className="text-sm text-muted-foreground text-sm mb-2">Plan Details</p>
            <Stack gap="sm">
              <Flex justify="between">
                <span className="text-sm">Tier</span>
                <span className="font-medium capitalize">
                  {subscription.tier}
                </span>
              </Flex>
              <Flex justify="between">
                <span className="text-sm">Billing Cycle</span>
                <span className="font-medium capitalize">
                  {subscription.billingCycle}
                </span>
              </Flex>
              <Flex justify="between">
                <span className="text-sm">Price</span>
                <span className="font-medium">
                  ${subscription.price}/
                  {subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </Flex>
              <Flex justify="between">
                <span className="text-sm">Status</span>
                <Badge
                  variant={subscription.status === 'active' ? 'default' : 'secondary'}
                >
                  {subscription.status}
                </Badge>
              </Flex>
            </Stack>
          </div>

          <div>
            <p className="text-sm text-muted-foreground text-sm mb-2">Features Included</p>
            <ul className="space-y-1.5">
              {tierFeatures[subscription.tier].map((feature) => (
                <li key={feature} className="flex gap-2 text-sm">
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
  )
}
