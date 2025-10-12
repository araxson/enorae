import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { getCouponAnalytics, getCouponServiceOptions } from './api/queries'
import { CouponForm } from './components/coupon-form'
import { CouponsList } from './components/coupons-list'
import { CouponAnalyticsOverview } from './components/coupon-analytics-overview'
import { BulkCouponGenerator } from './components/bulk-coupon-generator'
import { getUserSalon } from '@/features/business/business-common/api/queries'

export async function CouponManagement() {
  const salon = await getUserSalon()
  if (!salon?.id) {
    throw new Error('Salon not found')
  }

  const analytics = await getCouponAnalytics(salon.id)
  const services = await getCouponServiceOptions(salon.id)

  return (
    <Stack gap="xl">
      <div>
        <H1>Coupon & Promotion Management</H1>
        <P className="text-muted-foreground">
          Create and manage discount coupons to attract and retain customers
        </P>
      </div>

      <CouponAnalyticsOverview analytics={analytics} />

      <CouponForm salonId={salon.id} services={services} />

      <BulkCouponGenerator salonId={salon.id} />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Active Coupons</h2>
        <CouponsList
          coupons={analytics.coupons}
          salonId={salon.id}
          services={services}
        />
      </div>
    </Stack>
  )
}
