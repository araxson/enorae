'use client'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete coupon ${coupon.code}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete coupon?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The coupon and its performance history will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ButtonGroup>
      </div>
    </div>
  )
}
