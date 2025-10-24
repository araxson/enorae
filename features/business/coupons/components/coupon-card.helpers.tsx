import { Badge } from '@/components/ui/badge'
import type { CouponWithStats } from '@/features/business/coupons/api/queries/coupon-validation'
import { format } from 'date-fns'

export function isExpired(validUntil: string | null) {
  if (!validUntil) return false
  return new Date(validUntil) < new Date()
}

export function isUpcoming(validFrom: string | null) {
  if (!validFrom) return false
  return new Date(validFrom) > new Date()
}

export function getStatusBadge(coupon: CouponWithStats) {
  if (
    coupon.is_active &&
    !isExpired(coupon.valid_until) &&
    !isUpcoming(coupon.valid_from)
  ) {
    return <Badge variant="default">Active</Badge>
  }

  if (isExpired(coupon.valid_until)) {
    return <Badge variant="secondary">Expired</Badge>
  }

  if (isUpcoming(coupon.valid_from)) {
    return <Badge variant="outline">Upcoming</Badge>
  }

  return null
}

export function formatDiscount(coupon: CouponWithStats) {
  return coupon.discount_type === 'percentage'
    ? `${coupon.discount_value}% off`
    : `$${coupon.discount_value} off`
}

export function renderValidity(coupon: CouponWithStats) {
  const start = coupon.valid_from
    ? format(new Date(coupon.valid_from), 'MMM d')
    : 'N/A'
  const end = coupon.valid_until
    ? format(new Date(coupon.valid_until), 'MMM d, yyyy')
    : 'N/A'

  return `${start} – ${end}`
}
