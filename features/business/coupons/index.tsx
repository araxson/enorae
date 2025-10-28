import { getUserSalon } from '@/features/business/business-common/api/queries'
import { getCouponAnalytics, getCouponServiceOptions } from './api/queries'
import { CouponManagementContent } from './components/coupon-management-content'

export async function CouponManagement() {
  const salon = await getUserSalon()
  if (!salon?.id) {
    throw new Error('Salon not found')
  }

  const analytics = await getCouponAnalytics(salon.id)
  const services = await getCouponServiceOptions(salon.id)

  return <CouponManagementContent salonId={salon.id} analytics={analytics} services={services} />
}
