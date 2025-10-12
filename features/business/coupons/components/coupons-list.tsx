'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toggleCouponStatus, deleteCoupon } from '../api/coupons.mutations'
import { useToast } from '@/hooks/use-toast'
import { CouponForm } from './coupon-form'
import type { CouponWithStats } from '../api/queries/coupon-validation'
import { CouponCard } from './coupon-card'

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

  const handleDelete = async (coupon: CouponWithStats) => {
    if (!coupon.id || !coupon.code) return
    if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return

    try {
      await deleteCoupon(coupon.id)
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
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onCopy={handleCopyCode}
            onToggle={handleToggle}
            onEdit={(entry) => {
              setEditing(entry)
              setOpen(true)
            }}
            onDelete={handleDelete}
            resolveServiceName={(serviceId) =>
              serviceNameById.get(serviceId) || 'Unknown service'
            }
          />
        ))}
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
