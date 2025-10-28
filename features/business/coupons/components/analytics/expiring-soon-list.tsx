'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { buildCouponEffectiveness } from '@/features/business/coupons/api/queries/coupon-validation'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'

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
        <CardTitle>Expiring Soon</CardTitle>
        <CardDescription>Coupons ending within the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="flex flex-col gap-3">
          {coupons.map((coupon) => (
            <Item key={coupon.id} variant="outline" className="flex-wrap items-center justify-between gap-4">
              <ItemContent className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{coupon.code}</Badge>
                  <span className="font-medium">{coupon.description}</span>
                </div>
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
