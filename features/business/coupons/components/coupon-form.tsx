'use client'

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/lib/hooks/use-toast'
import { COUPONS_UNSUPPORTED_MESSAGE } from '@/features/business/coupons/api/messages'
import { CouponFormFields } from './coupon-form-fields'
import {
  defaultCouponFormState,
  type CouponFormProps,
  type CouponFormState,
} from '../api/types'

const mapCouponToState = (coupon?: CouponFormProps['coupon']): CouponFormState => {
  if (!coupon) {
    return { ...defaultCouponFormState }
  }

  return {
    code: coupon.code,
    description: coupon.description || '',
    discount_type: coupon.discount_type as 'percentage' | 'fixed',
    discount_value: Number(coupon.discount_value || 0),
    min_purchase_amount: coupon.min_purchase_amount || null,
    max_discount_amount: coupon.max_discount_amount || null,
    max_uses: coupon.max_uses || null,
    max_uses_per_customer: coupon.max_uses_per_customer || null,
    valid_from: coupon.valid_from ? coupon.valid_from.slice(0, 16) : '',
    valid_until: coupon.valid_until ? coupon.valid_until.slice(0, 16) : '',
    is_active: coupon.is_active ?? true,
    applicable_services: coupon.applicable_services || [],
    applicable_customer_ids: (coupon.applicable_customer_ids || []).join('\n'),
  }
}

export function CouponForm({ salonId, services, coupon, onSuccess }: CouponFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CouponFormState>(() => mapCouponToState(coupon))

  useEffect(() => {
    // Only reset form when coupon ID changes (switching between different coupons)
    setFormData(mapCouponToState(coupon))
  }, [coupon?.id])

  const isEditing = Boolean(coupon)

  const selectedServiceIds = useMemo(
    () => new Set(formData.applicable_services),
    [formData.applicable_services]
  )

  const generateCode = useCallback(() => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setFormData((current) => ({ ...current, code }))
  }, [])

  const toggleService = useCallback((serviceId: string, checked: boolean) => {
    setFormData((current) => {
      if (checked) {
        if (current.applicable_services.includes(serviceId)) return current
        return {
          ...current,
          applicable_services: [...current.applicable_services, serviceId],
        }
      }

      return {
        ...current,
        applicable_services: current.applicable_services.filter((id) => id !== serviceId),
      }
    })
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    toast({
      title: 'Coupons unavailable',
      description: COUPONS_UNSUPPORTED_MESSAGE,
      variant: 'destructive',
    })

    setIsLoading(false)
  }, [toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Coupon' : 'Create Coupon'}</CardTitle>
        <CardDescription>Generate and manage customer-facing coupon settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <CouponFormFields
          formData={formData}
          services={services}
          isLoading={isLoading}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onGenerateCode={generateCode}
          onFormDataChange={setFormData}
          onToggleService={toggleService}
        />
      </CardContent>
    </Card>
  )
}
