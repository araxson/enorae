'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, CalendarClock, Award, Activity } from 'lucide-react'
import { buildCouponEffectiveness } from '@/features/business/coupons/api/queries/coupon-validation'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type MetricCardsProps = {
  summary: ReturnType<typeof buildCouponEffectiveness>
  couponCount: number
}

export function CouponMetricCards({ summary, couponCount }: MetricCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Total Discount Issued</ItemTitle>
                <ItemDescription>
                  Avg ${summary.totals.averageDiscount.toFixed(2)} per redemption
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex-none text-muted-foreground">
                <DollarSign className="h-4 w-4" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>${summary.totals.totalDiscount.toFixed(2)}</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Total Redemptions</ItemTitle>
                <ItemDescription>
                  Across {couponCount} coupons
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex-none text-muted-foreground">
                <Activity className="h-4 w-4" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>{summary.totals.totalUses}</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Active Campaigns</ItemTitle>
                <ItemDescription>{summary.expiringSoon.length} expiring soon</ItemDescription>
              </ItemContent>
              <ItemActions className="flex-none text-muted-foreground">
                <Award className="h-4 w-4" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>{summary.totals.activeCoupons}</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Best Performer</ItemTitle>
                {summary.topCoupon ? (
                  <ItemDescription>{summary.topCoupon.stats.totalUses} uses</ItemDescription>
                ) : null}
              </ItemContent>
              <ItemActions className="flex-none text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          {summary.topCoupon ? (
            <ItemGroup>
              <Item>
                <ItemContent className="flex flex-col gap-1">
                  <Badge variant="secondary">{summary.topCoupon.code}</Badge>
                  <ItemDescription>
                    ${summary.topCoupon.stats.totalDiscount.toFixed(2)} in discounts
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          ) : (
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemDescription>No redemptions yet</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
