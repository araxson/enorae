'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack } from '@/components/layout'
import { DollarSign, CalendarClock, Award, Activity } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import type { CouponAnalyticsSnapshot } from '../api/queries/coupon-validation'
import { buildCouponEffectiveness } from '../api/queries/coupon-validation'

type CouponAnalyticsOverviewProps = {
  analytics: CouponAnalyticsSnapshot
}

export function CouponAnalyticsOverview({ analytics }: CouponAnalyticsOverviewProps) {
  const summary = buildCouponEffectiveness(analytics)

  return (
    <Stack gap="xl">
      <Grid cols={{ base: 1, md: 4 }} gap="md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discount Issued</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totals.totalDiscount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Avg ${summary.totals.averageDiscount.toFixed(2)} per redemption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totals.totalUses}</div>
            <p className="text-xs text-muted-foreground">
              Across {analytics.coupons.length} coupons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totals.activeCoupons}</div>
            <p className="text-xs text-muted-foreground">
              {summary.expiringSoon.length} expiring soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summary.topCoupon ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-sm">
                    {summary.topCoupon.code}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {summary.topCoupon.stats.totalUses} uses
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ${summary.topCoupon.stats.totalDiscount.toFixed(2)} in discounts
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No redemptions yet</p>
            )}
          </CardContent>
        </Card>
      </Grid>

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
            className="h-[260px] w-full"
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
            <div className="space-y-3">
              {summary.expiringSoon.map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between rounded-md border px-4 py-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {coupon.code}
                      </Badge>
                      <span className="text-sm font-medium">{coupon.description}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {coupon.valid_until
                        ? format(new Date(coupon.valid_until), 'MMM d, yyyy')
                        : 'No expiry date'}
                    </p>
                  </div>
                  <Badge variant="outline">{coupon.stats.totalUses} uses</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  )
}
