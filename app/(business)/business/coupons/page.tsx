import { CouponManagement } from '@/features/business/coupons'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Coupons',
  description: 'Create and track promotional coupon campaigns',
  noIndex: true,
})

export default async function CouponsPage() {
  return <CouponManagement />
}
