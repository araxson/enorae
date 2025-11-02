'use client'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Gift, Calendar } from 'lucide-react'
import { formatDiscount, renderValidity } from '../coupon-card-helpers'
import type { CouponWithStats } from '@/features/business/coupons/api/queries'

interface DetailsSectionProps {
  coupon: CouponWithStats
}

/**
 * Coupon details grid with discount, validity, and constraints
 */
export function DetailsSection({ coupon }: DetailsSectionProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
      <ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Item variant="muted" className="items-start gap-3">
          <ItemMedia variant="icon">
            <Gift className="size-4 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Discount</ItemTitle>
            <ItemDescription>{formatDiscount(coupon)}</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted" className="items-start gap-3">
          <ItemMedia variant="icon">
            <Calendar className="size-4 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Validity</ItemTitle>
            <ItemDescription>{renderValidity(coupon)}</ItemDescription>
          </ItemContent>
        </Item>
        {coupon.min_purchase_amount ? (
          <Item variant="muted" className="items-start gap-3">
            <ItemContent>
              <ItemTitle>Minimum purchase</ItemTitle>
              <ItemDescription>${coupon.min_purchase_amount}</ItemDescription>
            </ItemContent>
          </Item>
        ) : null}
        {coupon.max_uses ? (
          <Item variant="muted" className="items-start gap-3">
            <ItemContent>
              <ItemTitle>Max uses</ItemTitle>
              <ItemDescription>{coupon.max_uses} total</ItemDescription>
            </ItemContent>
          </Item>
        ) : null}
      </ItemGroup>
    </div>
  )
}
