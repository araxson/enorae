import type { CouponWithStats } from '@/features/business/coupons/api/queries'

/**
 * Coupon card component props
 */
export interface CouponCardProps {
  coupon: CouponWithStats
  onCopy: (code: string) => void
  onToggle: () => void
  onEdit: (coupon: CouponWithStats) => void
  onDelete: () => void
  resolveServiceName: (serviceId: string) => string
}
