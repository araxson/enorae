'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Stack, Grid } from '@/components/layout'
import { Copy, Trash2, Calendar, TrendingUp, Pencil, Users, Gift, BarChart3 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toggleCouponStatus, deleteCoupon } from '../api/coupons.mutations'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow, format } from 'date-fns'
import { CouponForm } from './coupon-form'
import type { CouponWithStats } from '../api/coupon-validation.queries'

type ServiceOption = { id: string; name: string }

interface CouponsListProps {
  coupons: CouponWithStats[]
  salonId: string
  services: ServiceOption[]
}

export function CouponsList({ coupons, salonId, services }: CouponsListProps) {
  const { toast } = useToast()
  const [editing, setEditing] = useState<CouponWithStats | null>(null)
  const [open, setOpen] = useState(false)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: 'Copied!',
      description: `Coupon code "${code}" copied to clipboard.`,
    })
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleCouponStatus(id, !isActive)
      toast({
        title: isActive ? 'Coupon deactivated' : 'Coupon activated',
        description: 'Coupon status updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update coupon status.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return

    try {
      await deleteCoupon(id)
      toast({
        title: 'Coupon deleted',
        description: 'Coupon has been deleted successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete coupon.',
        variant: 'destructive',
      })
    }
  }

  const isExpired = (validUntil: string) => new Date(validUntil) < new Date()
  const isUpcoming = (validFrom: string) => new Date(validFrom) > new Date()

  const serviceNameById = useMemo(() => {
    const map = new Map<string, string>()
    services.forEach((service) => map.set(service.id, service.name))
    return map
  }, [services])

  if (coupons.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No coupons created yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first coupon to attract and retain customers.
        </p>
      </Card>
    )
  }

  return (
    <>
      <Stack gap="md">
        {coupons.map((coupon) => {
          const statusBadge = (() => {
            if (coupon.is_active && !isExpired(coupon.valid_until) && !isUpcoming(coupon.valid_from)) {
              return <Badge variant="default">Active</Badge>
            }
            if (isExpired(coupon.valid_until)) {
              return <Badge variant="secondary">Expired</Badge>
            }
            if (isUpcoming(coupon.valid_from)) {
              return <Badge variant="outline">Upcoming</Badge>
            }
            return null
          })()

          const applicableServiceNames = coupon.applicable_services?.map(
            (serviceId) => serviceNameById.get(serviceId) || 'Unknown service'
          )

          return (
            <Card key={coupon.id} className="p-6">
              <Stack gap="md">
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
                        onClick={() => handleCopyCode(coupon.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {statusBadge}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{coupon.description}</p>
                    <Grid cols={{ base: 1, sm: 2 }} gap="md" className="text-sm">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Gift className="h-4 w-4 text-muted-foreground" />
                          Discount
                        </p>
                        <p className="text-muted-foreground">
                          {coupon.discount_type === 'percentage'
                            ? `${coupon.discount_value}% off`
                            : `$${coupon.discount_value} off`}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Validity
                        </p>
                        <p className="text-muted-foreground">
                          {format(new Date(coupon.valid_from), 'MMM d')} – {format(new Date(coupon.valid_until), 'MMM d, yyyy')}
                        </p>
                      </div>
                      {coupon.min_purchase_amount && coupon.min_purchase_amount > 0 ? (
                        <div>
                          <p className="font-medium">Minimum Purchase</p>
                          <p className="text-muted-foreground">${coupon.min_purchase_amount}</p>
                        </div>
                      ) : null}
                      {coupon.max_uses ? (
                        <div>
                          <p className="font-medium">Max Uses</p>
                          <p className="text-muted-foreground">{coupon.max_uses} total</p>
                        </div>
                      ) : null}
                    </Grid>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={coupon.is_active}
                      onCheckedChange={() => handleToggle(coupon.id, coupon.is_active)}
                      disabled={isExpired(coupon.valid_until)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(coupon)
                        setOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(coupon.id, coupon.code)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Grid cols={{ base: 1, md: 3 }} gap="md" className="rounded-md border p-4 bg-muted/30">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Uses</p>
                    <p className="text-xl font-semibold flex items-center gap-2">
                      {coupon.stats.totalUses}
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {coupon.stats.uniqueCustomers} unique customers
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Discount Given</p>
                    <p className="text-xl font-semibold">${coupon.stats.totalDiscount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      Avg ${coupon.stats.averageDiscount.toFixed(2)} per redemption
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Used</p>
                    <p className="text-sm font-medium">
                      {coupon.stats.lastUsedAt
                        ? formatDistanceToNow(new Date(coupon.stats.lastUsedAt), { addSuffix: true })
                        : 'No usage yet'}
                    </p>
                  </div>
                </Grid>

                {applicableServiceNames && applicableServiceNames.length ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      Limited to services
                    </Badge>
                    {applicableServiceNames.map((service) => (
                      <Badge key={service} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                {coupon.applicable_customer_ids && coupon.applicable_customer_ids.length ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Targeted to {coupon.applicable_customer_ids.length} specific customers
                  </div>
                ) : null}
              </Stack>
            </Card>
          )
        })}
      </Stack>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>Update coupon details and restrictions.</DialogDescription>
          </DialogHeader>
          {editing ? (
            <CouponForm
              salonId={salonId}
              services={services}
              coupon={editing}
              onSuccess={() => {
                setOpen(false)
                setEditing(null)
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
