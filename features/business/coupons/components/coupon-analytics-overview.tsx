'use client'

import type { CouponAnalyticsSnapshot } from '@/features/business/coupons/api/queries'
import { buildCouponEffectiveness } from '@/features/business/coupons/api/queries'
import { CouponMetricCards } from './analytics/metric-cards'
import { RedemptionTrendChart } from './analytics/redemption-trend-chart'
import { ExpiringSoonList } from './analytics/expiring-soon-list'

type CouponAnalyticsOverviewProps = {
  analytics: CouponAnalyticsSnapshot
}

export function CouponAnalyticsOverview({ analytics }: CouponAnalyticsOverviewProps) {
  const summary = buildCouponEffectiveness(analytics)

  return (
    <div className="flex flex-col gap-8">
      <CouponMetricCards summary={summary} couponCount={analytics.coupons.length} />
      <RedemptionTrendChart trend={summary.trend} />
      <ExpiringSoonList coupons={summary.expiringSoon} />
    </div>
  )
}
