'use client'

import { Star, Trophy, TrendingUp } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { LoyaltyPoints } from '@/features/customer/loyalty/api/queries'

type Props = {
  points: LoyaltyPoints
  formatNumber: (value: number) => string
}

export function LoyaltyStatsCards({ points, formatNumber }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemContent>
            <ItemTitle>Total points</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Star className="size-5" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            {formatNumber(points.total_points)}
          </p>
          <ItemDescription>Available to redeem</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemContent>
            <ItemTitle>Current tier</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Trophy className="size-5" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            {points.tier.toUpperCase()}
          </p>
          <ItemDescription>Member tier</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemContent>
            <ItemTitle>Lifetime earned</ItemTitle>
          </ItemContent>
          <ItemActions>
            <TrendingUp className="size-5" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            {formatNumber(points.points_earned)}
          </p>
          <ItemDescription>Total points earned</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
