import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { getCouponAnalytics } from './api/coupon-validation.queries'
import { CouponForm } from './components/coupon-form'
import { CouponsList } from './components/coupons-list'
import { CouponAnalyticsOverview } from './components/coupon-analytics-overview'
import { BulkCouponGenerator } from './components/bulk-coupon-generator'
import { getUserSalon } from '../shared/api/salon.queries'

export async function CouponManagement() {
  const salon = await getUserSalon()
  const analytics = await getCouponAnalytics(salon.id)

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: servicesData } = await supabase
    .from('services')
    .select('id, name')
    .eq('salon_id', salon.id)
    .eq('is_active', true)

  const services = (servicesData || []) as Array<{ id: string; name: string }>

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
