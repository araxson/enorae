'use client'

import { Badge } from '@/components/ui/badge'
import { DollarSign, Award, Activity } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { buildCouponEffectiveness } from '@/features/business/coupons/api/queries'

type MetricCardsProps = {
  summary: ReturnType<typeof buildCouponEffectiveness>
  couponCount: number
}

export function CouponMetricCards({ summary, couponCount }: MetricCardsProps) {
  const metricValueClass = 'text-2xl font-semibold tracking-tight'

  return (
    <ItemGroup className="grid gap-4 grid-cols-1 md:grid-cols-4">
      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Total Discount Issued</ItemTitle>
          <ItemActions>
            <DollarSign className="size-4 text-muted-foreground" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={metricValueClass}>${summary.totals.totalDiscount.toFixed(2)}</p>
          <ItemDescription>
            Avg ${summary.totals.averageDiscount.toFixed(2)} per redemption
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Total Redemptions</ItemTitle>
          <ItemActions>
            <Activity className="size-4 text-muted-foreground" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={metricValueClass}>{summary.totals.totalUses}</p>
          <ItemDescription>Across {couponCount} coupons</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Active Campaigns</ItemTitle>
          <ItemActions>
            <Award className="size-4 text-muted-foreground" aria-hidden="true" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={metricValueClass}>{summary.totals.activeCoupons}</p>
          <ItemDescription>{summary.expiringSoon.length} expiring soon</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Best Performer</ItemTitle>
        </ItemHeader>
        <ItemContent>
          {summary.topCoupon ? (
            <>
              <Badge variant="secondary">{summary.topCoupon.code}</Badge>
              <ItemDescription>
                {summary.topCoupon.stats.totalUses} uses • ${summary.topCoupon.stats.totalDiscount.toFixed(2)} in discounts
              </ItemDescription>
            </>
          ) : (
            <>
              <p className={metricValueClass}>--</p>
              <ItemDescription>No redemptions yet</ItemDescription>
            </>
          )}
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
