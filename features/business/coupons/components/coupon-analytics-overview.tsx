'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, CalendarClock, Award, Activity } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import type { CouponAnalyticsSnapshot } from '@/features/business/coupons/api/queries/coupon-validation'
import { buildCouponEffectiveness } from '@/features/business/coupons/api/queries/coupon-validation'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type CouponAnalyticsOverviewProps = {
  analytics: CouponAnalyticsSnapshot
}

export function CouponAnalyticsOverview({ analytics }: CouponAnalyticsOverviewProps) {
  const summary = buildCouponEffectiveness(analytics)

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <CardTitle>Total Discount Issued</CardTitle>
                  <CardDescription>
                    Avg ${summary.totals.averageDiscount.toFixed(2)} per redemption
                  </CardDescription>
                </ItemContent>
                <ItemActions className="flex-none text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${summary.totals.totalDiscount.toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <CardTitle>Total Redemptions</CardTitle>
                  <CardDescription>
                    Across {analytics.coupons.length} coupons
                  </CardDescription>
                </ItemContent>
                <ItemActions className="flex-none text-muted-foreground">
                  <Activity className="h-4 w-4" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{summary.totals.totalUses}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <CardTitle>Active Campaigns</CardTitle>
                  <CardDescription>{summary.expiringSoon.length} expiring soon</CardDescription>
                </ItemContent>
                <ItemActions className="flex-none text-muted-foreground">
                  <Award className="h-4 w-4" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{summary.totals.activeCoupons}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <CardTitle>Best Performer</CardTitle>
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
                  <ItemContent>
                    <ItemTitle>
                      <Badge variant="secondary">{summary.topCoupon.code}</Badge>
                    </ItemTitle>
                    <ItemDescription>
                      ${summary.topCoupon.stats.totalDiscount.toFixed(2)} in discounts
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            ) : (
              <CardDescription>No redemptions yet</CardDescription>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Redemption Trend</CardTitle>
          <CardDescription>Daily coupon usage and discount impact</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              uses: { label: 'Uses', color: 'hsl(var(--chart-1))' },
              discount: { label: 'Discount', color: 'hsl(var(--chart-2))' },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer>
              <AreaChart
                data={summary.trend.map((point) => ({
                  ...point,
                  label: format(new Date(point.date), 'MMM dd'),
                }))}
                margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="uses"
                  yAxisId="left"
                  stroke="var(--color-uses)"
                  fill="var(--color-uses)"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="discount"
                  yAxisId="right"
                  stroke="var(--color-discount)"
                  fill="var(--color-discount)"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {summary.expiringSoon.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Expiring Soon</CardTitle>
            <CardDescription>Coupons ending within the next 7 days</CardDescription>
          </CardHeader>
        <CardContent>
          <ItemGroup className="flex flex-col gap-3">
            {summary.expiringSoon.map((coupon) => (
              <Item key={coupon.id} variant="outline" className="flex-wrap items-center justify-between gap-4">
                <ItemContent>
                  <ItemTitle>
                    <Badge variant="secondary">{coupon.code}</Badge>
                    <span>{coupon.description}</span>
                  </ItemTitle>
                  <ItemDescription>
                    {coupon.valid_until
                      ? format(new Date(coupon.valid_until), 'MMM d, yyyy')
                      : 'No expiry date'}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Badge variant="outline">{coupon.stats.totalUses} uses</Badge>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
      ) : null}
    </div>
  )
}
