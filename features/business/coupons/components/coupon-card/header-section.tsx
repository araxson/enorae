'use client'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ButtonGroup } from '@/components/ui/button-group'
import { Copy, Trash2, Pencil } from 'lucide-react'
import { isExpired, getStatusBadge } from '../coupon-card-helpers'
import type { CouponWithStats } from '@/features/business/coupons/api/queries'

interface HeaderSectionProps {
  coupon: CouponWithStats
  onCopy: (code: string) => void
  onToggle: () => void
  onEdit: (coupon: CouponWithStats) => void
  onDelete: () => void
}

/**
 * Coupon card header with actions and status
 */
export function HeaderSection({ coupon, onCopy, onToggle, onEdit, onDelete }: HeaderSectionProps) {
  const statusBadge = getStatusBadge(coupon)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <ButtonGroup>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => coupon.code && onCopy(coupon.code)}
            aria-label={`Copy coupon code ${coupon.code}`}
          >
            <Copy className="size-4" />
          </Button>
        </ButtonGroup>
        {statusBadge}
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={coupon.is_active}
          onCheckedChange={onToggle}
          disabled={isExpired(coupon.valid_until)}
          aria-label={`Toggle coupon ${coupon.code} ${coupon.is_active ? 'inactive' : 'active'}`}
        />
        <ButtonGroup>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(coupon)}
            aria-label={`Edit coupon ${coupon.code}`}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={`Delete coupon ${coupon.code}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
