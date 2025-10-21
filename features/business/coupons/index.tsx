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
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Coupon & Promotion Management</h1>
        <p className="leading-7 text-muted-foreground">
          Create and manage discount coupons to attract and retain customers
        </p>
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
    </div>
  )
}
