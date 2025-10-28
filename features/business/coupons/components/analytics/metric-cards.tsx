'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, CalendarClock, Award, Activity } from 'lucide-react'
import { buildCouponEffectiveness } from '@/features/business/coupons/api/queries/coupon-validation'

type MetricCardsProps = {
  summary: ReturnType<typeof buildCouponEffectiveness>
  couponCount: number
}

export function CouponMetricCards({ summary, couponCount }: MetricCardsProps) {
  const metricValueClass = 'text-3xl font-semibold tracking-tight'

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Discount Issued</CardTitle>
          <CardDescription>
            Avg ${summary.totals.averageDiscount.toFixed(2)} per redemption
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className={metricValueClass}>${summary.totals.totalDiscount.toFixed(2)}</p>
          <DollarSign className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Redemptions</CardTitle>
          <CardDescription>Across {couponCount} coupons</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className={metricValueClass}>{summary.totals.totalUses}</p>
          <Activity className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>{summary.expiringSoon.length} expiring soon</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className={metricValueClass}>{summary.totals.activeCoupons}</p>
          <Award className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best Performer</CardTitle>
          {summary.topCoupon ? (
            <CardDescription>{summary.topCoupon.stats.totalUses} uses</CardDescription>
          ) : (
            <CardDescription>No leading coupon yet</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {summary.topCoupon ? (
            <div className="flex flex-col gap-2">
              <Badge variant="secondary">{summary.topCoupon.code}</Badge>
              <p className="text-sm text-muted-foreground">
                ${summary.topCoupon.stats.totalDiscount.toFixed(2)} in discounts
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No redemptions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
