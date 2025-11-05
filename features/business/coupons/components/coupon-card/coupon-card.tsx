'use client'


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HeaderSection } from './header-section'
import { DetailsSection } from './details-section'
import { PerformanceSection } from './performance-section'
import { ApplicabilitySection } from './applicability-section'
import type { CouponCardProps } from '../../api/types'

/**
 * Coupon card component displaying coupon details and performance
 *
 * Features:
 * - Copy, edit, delete, and toggle actions
 * - Status badge (active, expired, upcoming)
 * - Discount and validity information
 * - Performance metrics (uses, discount given)
 * - Service and customer applicability
 */
export function CouponCard({
  coupon,
  onCopy,
  onToggle,
  onEdit,
  onDelete,
  resolveServiceName,
}: CouponCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{coupon.code}</CardTitle>
        {coupon.description ? <CardDescription>{coupon.description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <HeaderSection
          coupon={coupon}
          onCopy={onCopy}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <DetailsSection coupon={coupon} />

        <PerformanceSection coupon={coupon} />

        <ApplicabilitySection coupon={coupon} resolveServiceName={resolveServiceName} />
      </CardContent>
    </Card>
  )
}
