'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import type { LoyaltyPoints } from '@/features/customer/loyalty/api/queries'

type Props = {
  points: LoyaltyPoints
  formatNumber: (value: number) => string
}

export function LoyaltyTierProgress({ points, formatNumber }: Props) {
  const tierProgress =
    points.next_tier_points > 0
      ? (points.total_points / points.next_tier_points) * 100
      : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress to next tier</CardTitle>
        <CardDescription>Keep booking appointments to unlock new rewards.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Progress value={tierProgress} className="h-3" />
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemDescription>{formatNumber(points.total_points)} points earned</ItemDescription>
              </ItemContent>
              <ItemActions className="flex-none">
                <ItemDescription>{formatNumber(points.next_tier_points)} needed</ItemDescription>
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  )
}
