import { useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { bulkGenerateCoupons } from '@/features/business/coupons/api/mutations/coupons'
import type { BulkCouponFormState } from './types'

const INITIAL_FORM_STATE: BulkCouponFormState = {
  prefix: 'SAVE',
  description: 'Seasonal promotion',
  discount_type: 'percentage',
  discount_value: 10,
  count: 10,
  valid_from: '',
  valid_until: '',
  is_active: true,
  min_purchase_amount: null,
  max_discount_amount: null,
}

export function useBulkCouponForm(salonId: string) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<BulkCouponFormState>(INITIAL_FORM_STATE)

  const updateFormState = (updates: Partial<BulkCouponFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const validFrom = formState.valid_from
        ? new Date(formState.valid_from).toISOString()
        : new Date().toISOString()
      const validUntil = formState.valid_until
        ? new Date(formState.valid_until).toISOString()
        : new Date().toISOString()

      await bulkGenerateCoupons(salonId, {
        prefix: formState.prefix,
        description: formState.description,
        discount_type: formState.discount_type,
        discount_value: Number(formState.discount_value),
        count: Number(formState.count),
        valid_from: validFrom,
        valid_until: validUntil,
        is_active: formState.is_active,
        min_purchase_amount: formState.min_purchase_amount,
        max_discount_amount: formState.max_discount_amount,
      })

      toast({
        title: 'Coupons generated',
        description: `${formState.count} coupon codes created successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Bulk generation failed',
        description: 'Unable to generate coupons. Please review your configuration.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formState,
    updateFormState,
    isSubmitting,
    handleSubmit,
  }
}
