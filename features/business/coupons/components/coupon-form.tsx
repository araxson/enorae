'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Card } from '@/components/ui/card'
import { useToast } from '@/lib/hooks/use-toast'
import { createCoupon, updateCoupon } from '../api/coupons.mutations'
import { CouponFormFields } from './coupon-form-fields'
import {
  defaultCouponFormState,
  type CouponFormProps,
  type CouponFormState,
} from './coupon-form.types'

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
    setFormData(mapCouponToState(coupon))
  }, [coupon])

  const isEditing = Boolean(coupon)

  const selectedServiceIds = useMemo(
    () => new Set(formData.applicable_services),
    [formData.applicable_services]
  )

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setFormData((current) => ({ ...current, code }))
  }

  const toggleService = (serviceId: string, checked: boolean) => {
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
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        salon_id: salonId,
        code: formData.code.trim(),
        description: formData.description.trim(),
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        min_purchase_amount:
          formData.min_purchase_amount !== null ? Number(formData.min_purchase_amount) : undefined,
        max_discount_amount:
          formData.max_discount_amount !== null ? Number(formData.max_discount_amount) : undefined,
        max_uses: formData.max_uses !== null ? Number(formData.max_uses) : undefined,
        max_uses_per_customer:
          formData.max_uses_per_customer !== null ? Number(formData.max_uses_per_customer) : undefined,
        valid_from: formData.valid_from
          ? new Date(formData.valid_from).toISOString()
          : new Date().toISOString(),
        valid_until: formData.valid_until
          ? new Date(formData.valid_until).toISOString()
          : new Date().toISOString(),
        is_active: formData.is_active,
        applicable_services: formData.applicable_services.length
          ? formData.applicable_services
          : undefined,
        applicable_customer_ids: formData.applicable_customer_ids
          ? formData.applicable_customer_ids
              .split(/\r?\n/)
              .map((value) => value.trim())
              .filter(Boolean)
          : undefined,
      }

      if (isEditing && coupon?.id) {
        await updateCoupon(coupon.id, payload)
      } else {
        await createCoupon(payload)
      }

      toast({
        title: isEditing ? 'Coupon updated' : 'Coupon created',
        description: `Coupon code "${formData.code}" has been ${
          isEditing ? 'updated' : 'created'
        } successfully.`,
      })

      onSuccess?.()

      if (!isEditing) {
        setFormData(() => mapCouponToState())
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} coupon. Please try again.`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <CouponFormFields
        formData={formData}
        services={services}
        selectedServiceIds={selectedServiceIds}
        isLoading={isLoading}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        onGenerateCode={generateCode}
        onFormDataChange={setFormData}
        onToggleService={toggleService}
      />
    </Card>
  )
}
