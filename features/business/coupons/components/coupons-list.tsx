'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { COUPONS_UNSUPPORTED_MESSAGE } from '@/features/business/coupons/api/messages'
import { useToast } from '@/lib/hooks/use-toast'
import { CouponForm } from './coupon-form'
import type { CouponWithStats } from '@/features/business/coupons/api/queries/coupon-validation'
import { CouponCard } from './coupon-card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

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

  const handleToggle = async () => {
    toast({
      title: 'Coupons unavailable',
      description: COUPONS_UNSUPPORTED_MESSAGE,
      variant: 'destructive',
    })
  }

  const handleDelete = async () => {
    toast({
      title: 'Coupons unavailable',
      description: COUPONS_UNSUPPORTED_MESSAGE,
      variant: 'destructive',
    })
  }

  const serviceNameById = useMemo(() => {
    const map = new Map<string, string>()
    services.forEach((service) => map.set(service.id, service.name))
    return map
  }, [services])

  if (coupons.length === 0) {
    return (
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No coupons created yet</EmptyTitle>
              <EmptyDescription>Create your first coupon to attract and retain customers.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
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
      </div>

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
