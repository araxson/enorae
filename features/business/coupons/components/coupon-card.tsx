'use client'

import { memo, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
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
import type { CouponWithStats } from '../api/queries/coupon-validation'
import {
  getStatusBadge,
  formatDiscount,
  isExpired,
  renderValidity,
} from './coupon-card.helpers'

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
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <code className="px-3 py-1 bg-muted rounded-md font-mono text-lg font-bold">
                {coupon.code}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => coupon.code && onCopy(coupon.code)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              {statusBadge}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {coupon.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  Discount
                </p>
                <p className="text-muted-foreground">{formatDiscount(coupon)}</p>
              </div>
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Validity
                </p>
                <p className="text-muted-foreground">{renderValidity(coupon)}</p>
              </div>
              {coupon.min_purchase_amount ? (
                <div>
                  <p className="font-medium">Minimum Purchase</p>
                  <p className="text-muted-foreground">
                    ${coupon.min_purchase_amount}
                  </p>
                </div>
              ) : null}
              {coupon.max_uses ? (
                <div>
                  <p className="font-medium">Max Uses</p>
                  <p className="text-muted-foreground">{coupon.max_uses} total</p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={coupon.is_active}
              onCheckedChange={onToggle}
              disabled={isExpired(coupon.valid_until)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(coupon)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Uses
              </p>
              <p className="flex items-center gap-2 text-xl font-semibold">
                {coupon.stats.totalUses}
                <TrendingUp className="h-4 w-4 text-success" />
              </p>
              <p className="text-xs text-muted-foreground">
                {coupon.stats.uniqueCustomers} unique customers
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Discount Given
              </p>
              <p className="text-xl font-semibold">
                ${coupon.stats.totalDiscount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                Avg ${coupon.stats.averageDiscount.toFixed(2)} per redemption
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Last Used
              </p>
              <p className="text-sm font-medium">
                {coupon.stats.lastUsedAt
                  ? formatDistanceToNow(new Date(coupon.stats.lastUsedAt), {
                      addSuffix: true,
                    })
                  : 'No usage yet'}
              </p>
            </div>
          </CardContent>
        </Card>

        {serviceNames.length ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Limited to services
            </Badge>
            {serviceNames.map((service) => (
              <Badge key={service} variant="outline">
                {service}
              </Badge>
            ))}
          </div>
        ) : null}

        {coupon.applicable_customer_ids?.length ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Targeted to {coupon.applicable_customer_ids.length} specific customers
          </div>
        ) : null}
      </div>
    </Card>
  )
})
