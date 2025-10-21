import { Crown, TrendingUp } from 'lucide-react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import type { CustomerVipStatus } from '../api/queries/vip'

type VIPStatusCardProps = {
  vipStatus: CustomerVipStatus
}

export function VIPStatusCard({ vipStatus }: VIPStatusCardProps) {
  if (!vipStatus.isVIP) return null

  return (
    <Card className="border border-primary/10">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Crown className="h-5 w-5" />
          <CardTitle>VIP status</CardTitle>
        </div>
        <CardDescription>Exclusive benefits and rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 sm:grid-cols-2 lg:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
          {[
            {
              title: 'Loyalty points',
              value: vipStatus.loyaltyPoints?.toLocaleString() ?? 0,
              badgeText: 'Spendable',
              footer: 'Usable on eligible rewards immediately.',
            },
            {
              title: 'Tier',
              value: vipStatus.loyaltyTier ?? 'Standard',
              badgeText: 'Membership',
              footer: 'Higher tiers unlock extra perks.',
            },
            {
              title: 'Lifetime spend',
              value: `$${vipStatus.lifetimeSpend?.toLocaleString() ?? 0}`,
              badgeText: 'All time',
              footer: 'Cumulative spend across all visits.',
            },
          ].map(({ title, value, badgeText, footer }) => (
            <Card key={title} className="@container/card">
              <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle>
                  {value}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">{badgeText}</Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">{footer}</div>
              </CardFooter>
            </Card>
          ))}
          {vipStatus.monthlySpend !== undefined ? (
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>This month</CardDescription>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <CardTitle>${vipStatus.monthlySpend.toLocaleString()}</CardTitle>
                </div>
                <CardAction>
                  <Badge variant="outline">Monthly total</Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                  Points will post once appointments complete.
                </div>
              </CardFooter>
            </Card>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <CardDescription>
          Maintain VIP status by meeting monthly spend requirements.
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
