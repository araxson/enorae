import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { BulkCouponGenerator, CouponAnalyticsOverview, CouponForm, CouponsList } from '.'
import type { getCouponAnalytics, getCouponServiceOptions } from '../api/queries'

type CouponManagementContentProps = {
  salonId: string
  analytics: Awaited<ReturnType<typeof getCouponAnalytics>>
  services: Awaited<ReturnType<typeof getCouponServiceOptions>>
}

export function CouponManagementContent({
  salonId,
  analytics,
  services,
}: CouponManagementContentProps) {
  return (
    <div className="flex flex-col gap-8">
      <ItemGroup className="gap-2">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Coupon & Promotion Management</ItemTitle>
            <ItemDescription>
              Create and manage discount coupons to attract and retain customers
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

      <CouponAnalyticsOverview analytics={analytics} />

      <CouponForm salonId={salonId} services={services} />

      <BulkCouponGenerator salonId={salonId} />

      <ItemGroup className="flex flex-col gap-4">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Active Coupons</ItemTitle>
          </ItemContent>
        </Item>
        <CouponsList coupons={analytics.coupons} salonId={salonId} services={services} />
      </ItemGroup>
    </div>
  )
}
