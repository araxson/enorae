'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Item, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { CouponWithStats } from '@/features/business/coupons/api/queries'

interface PerformanceSectionProps {
  coupon: CouponWithStats
}

/**
 * Coupon performance metrics card
 */
export function PerformanceSection({ coupon }: PerformanceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance</CardTitle>
        <CardDescription>Usage and discount impact</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 pt-0 md:grid-cols-3">
        <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Item variant="muted" className="flex-col gap-2">
            <ItemTitle>Total uses</ItemTitle>
            <div className="flex items-center gap-2 text-xl font-semibold">
              {coupon.stats.totalUses}
              <TrendingUp className="size-4 text-primary" />
            </div>
            <ItemDescription>{coupon.stats.uniqueCustomers} unique customers</ItemDescription>
          </Item>
          <Item variant="muted" className="flex-col gap-2">
            <ItemTitle>Discount given</ItemTitle>
            <div className="text-xl font-semibold">${coupon.stats.totalDiscount.toFixed(2)}</div>
            <ItemDescription>
              Avg ${coupon.stats.averageDiscount.toFixed(2)} per redemption
            </ItemDescription>
          </Item>
          <Item variant="muted" className="flex-col gap-2">
            <ItemTitle>Last used</ItemTitle>
            <ItemDescription>
              {coupon.stats.lastUsedAt
                ? formatDistanceToNow(new Date(coupon.stats.lastUsedAt), { addSuffix: true })
                : 'No usage yet'}
            </ItemDescription>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
