'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { BarChart3, Users } from 'lucide-react'
import type { CouponWithStats } from '@/features/business/coupons/api/queries'

interface ApplicabilitySectionProps {
  coupon: CouponWithStats
  resolveServiceName: (serviceId: string) => string
}

/**
 * Coupon applicability section showing service and customer restrictions
 */
export function ApplicabilitySection({ coupon, resolveServiceName }: ApplicabilitySectionProps) {
  const serviceNames = useMemo(() => {
    return (
      coupon.applicable_services?.map(
        (serviceId) => resolveServiceName(serviceId) || 'Unknown service'
      ) ?? []
    )
  }, [coupon.applicable_services, resolveServiceName])

  return (
    <>
      {serviceNames.length ? (
        <Field>
          <FieldLabel>
            <div className="flex items-center gap-1">
              <BarChart3 className="size-3" />
              Limited to services
            </div>
          </FieldLabel>
          <FieldContent className="flex flex-wrap items-center gap-2 pt-1">
            {serviceNames.map((service) => (
              <Badge key={service} variant="outline">
                {service}
              </Badge>
            ))}
          </FieldContent>
        </Field>
      ) : null}

      {coupon.applicable_customer_ids?.length ? (
        <Field>
          <FieldContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            Targeted to {coupon.applicable_customer_ids.length} specific customers
          </FieldContent>
        </Field>
      ) : null}
    </>
  )
}
