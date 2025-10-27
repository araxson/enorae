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
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from '@/components/ui/item'

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
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Crown className="h-5 w-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>VIP status</CardTitle>
              <CardDescription>Exclusive benefits and rewards</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
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
                <ItemGroup>
                  <Item>
                    <ItemMedia variant="icon">
                      <Crown className="h-4 w-4" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <span className="text-2xl font-semibold text-foreground">{value}</span>
                    </ItemContent>
                    <ItemActions className="flex-none">
                      <Badge variant="outline">{badgeText}</Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardContent>
              <CardFooter>
                <CardDescription>{footer}</CardDescription>
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
                <ItemGroup>
                  <Item>
                    <ItemMedia variant="icon">
                      <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <span className="text-2xl font-semibold text-foreground">
                        ${vipStatus.monthlySpend.toLocaleString()}
                      </span>
                    </ItemContent>
                    <ItemActions className="flex-none">
                      <Badge variant="outline">Monthly total</Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardContent>
              <CardFooter>
                <CardDescription>Points will post once appointments complete.</CardDescription>
              </CardFooter>
            </Card>
          ) : null}
        </div>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Maintain VIP status by meeting monthly spend requirements.
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
