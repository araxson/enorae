'use client'

import { memo, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import {
  Copy,
  Trash2,
  Calendar,
  TrendingUp,
  Pencil,
  Users,
  Gift,
  BarChart3,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { CouponWithStats } from '@/features/business/coupons/api/queries/coupon-validation'
import {
  getStatusBadge,
  formatDiscount,
  isExpired,
  renderValidity,
} from './coupon-card.helpers'
import { ButtonGroup } from '@/components/ui/button-group'

export interface CouponCardProps {
  coupon: CouponWithStats
  onCopy: (code: string) => void
  onToggle: () => void
  onEdit: (coupon: CouponWithStats) => void
  onDelete: () => void
  resolveServiceName: (serviceId: string) => string
}

export const CouponCard = memo(function CouponCard({
  coupon,
  onCopy,
  onToggle,
  onEdit,
  onDelete,
  resolveServiceName,
}: CouponCardProps) {
  const serviceNames = useMemo(() => {
    return (
      coupon.applicable_services?.map(
        (serviceId) => resolveServiceName(serviceId) || 'Unknown service',
      ) ?? []
    )
  }, [coupon.applicable_services, resolveServiceName])

  const statusBadge = getStatusBadge(coupon)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle>{coupon.code}</CardTitle>
            {coupon.description ? <CardDescription>{coupon.description}</CardDescription> : null}
          </div>
          <div className="flex items-center gap-2">
            <ButtonGroup>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => coupon.code && onCopy(coupon.code)}
                aria-label={`Copy coupon code ${coupon.code}`}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </ButtonGroup>
            {statusBadge}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Item variant="muted" className="items-start gap-3">
              <ItemMedia variant="icon">
                <Gift className="h-4 w-4 text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Discount</ItemTitle>
                <ItemDescription>{formatDiscount(coupon)}</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted" className="items-start gap-3">
              <ItemMedia variant="icon">
                <Calendar className="h-4 w-4 text-muted-foreground" />
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
          <div className="flex items-center gap-2 self-start">
            <Switch
              checked={coupon.is_active}
              onCheckedChange={onToggle}
              disabled={isExpired(coupon.valid_until)}
              aria-label={`Toggle coupon ${coupon.code} ${coupon.is_active ? 'inactive' : 'active'}`}
            />
            <ButtonGroup>
              <Button variant="ghost" size="icon" onClick={() => onEdit(coupon)} aria-label={`Edit coupon ${coupon.code}`}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete} aria-label={`Delete coupon ${coupon.code}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="pb-2">
              <CardTitle>Performance</CardTitle>
              <CardDescription>Usage and discount impact</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 pt-0 md:grid-cols-3">
            <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Item variant="muted" className="flex-col gap-2">
                <ItemTitle>Total uses</ItemTitle>
                <div className="flex items-center gap-2 text-xl font-semibold">
                  {coupon.stats.totalUses}
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <ItemDescription>
                  {coupon.stats.uniqueCustomers} unique customers
                </ItemDescription>
              </Item>
              <Item variant="muted" className="flex-col gap-2">
                <ItemTitle>Discount given</ItemTitle>
                <div className="text-xl font-semibold">
                  ${coupon.stats.totalDiscount.toFixed(2)}
                </div>
                <ItemDescription>
                  Avg ${coupon.stats.averageDiscount.toFixed(2)} per redemption
                </ItemDescription>
              </Item>
              <Item variant="muted" className="flex-col gap-2">
                <ItemTitle>Last used</ItemTitle>
                <ItemDescription>
                  {coupon.stats.lastUsedAt
                    ? formatDistanceToNow(new Date(coupon.stats.lastUsedAt), { addSuffix: true })
                    : 'No usage yet'}
                </ItemDescription>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>

        {serviceNames.length ? (
          <Field>
            <FieldLabel>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
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
              <Users className="h-4 w-4" />
              Targeted to {coupon.applicable_customer_ids.length} specific customers
            </FieldContent>
          </Field>
        ) : null}
      </CardContent>
    </Card>
  )
})
