'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { buildCouponEffectiveness } from '@/features/business/coupons/api/queries/coupon-validation'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type ExpiringSoonListProps = {
  coupons: ReturnType<typeof buildCouponEffectiveness>['expiringSoon']
}

export function ExpiringSoonList({ coupons }: ExpiringSoonListProps) {
  if (coupons.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>Expiring Soon</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>Coupons ending within the next 7 days</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="flex flex-col gap-3">
          {coupons.map((coupon) => (
            <Item key={coupon.id} variant="outline" className="flex-wrap items-center justify-between gap-4">
              <ItemContent>
                <ItemTitle>
                  <Badge variant="secondary">{coupon.code}</Badge>
                  <span>{coupon.description}</span>
                </ItemTitle>
                <ItemDescription>
                  {coupon.valid_until
                    ? format(new Date(coupon.valid_until), 'MMM d, yyyy')
                    : 'No expiry date'}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex-none">
                <Badge variant="outline">{coupon.stats.totalUses} uses</Badge>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
