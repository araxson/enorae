import { Crown, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import type { CustomerVipStatus } from '@/features/customer/dashboard/api/queries'

type VIPStatusCardProps = {
  vipStatus: CustomerVipStatus
}

export function VIPStatusCard({ vipStatus }: VIPStatusCardProps) {
  if (!vipStatus.isVIP) return null

  const insights = [
    {
      title: 'Loyalty points',
      value: vipStatus.loyaltyPoints?.toLocaleString() ?? 0,
      badgeText: 'Spendable',
      description: 'Total points available',
      footer: 'Usable on eligible rewards immediately.',
    },
    {
      title: 'Tier',
      value: vipStatus.loyaltyTier ?? 'Standard',
      badgeText: 'Membership',
      description: 'Current membership level',
      footer: 'Higher tiers unlock extra perks.',
    },
    {
      title: 'Lifetime spend',
      value: `$${vipStatus.lifetimeSpend?.toLocaleString() ?? 0}`,
      badgeText: 'All time',
      description: 'All-time total',
      footer: 'Cumulative spend across all visits.',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            VIP status
          </span>
        </CardTitle>
        <CardDescription>Exclusive benefits and rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map(({ title, value, badgeText, description, footer }) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold text-foreground">{value}</p>
                  <Badge variant="outline">{badgeText}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">{footer}</p>
              </CardFooter>
            </Card>
          ))}
          {vipStatus.monthlySpend !== undefined ? (
            <Card>
              <CardHeader>
                <CardTitle>This month</CardTitle>
                <CardDescription>Current monthly spend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                    <p className="text-2xl font-semibold text-foreground">
                      ${vipStatus.monthlySpend.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">Monthly total</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Points will post once appointments complete.
                </p>
              </CardFooter>
            </Card>
          ) : null}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Maintain VIP status by meeting monthly spend requirements.
        </p>
      </CardFooter>
    </Card>
  )
}
