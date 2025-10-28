'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { COUPONS_UNSUPPORTED_MESSAGE } from '@/features/business/coupons/api/messages'
import { useToast } from '@/lib/hooks/use-toast'
import { FieldSet } from '@/components/ui/field'
import {
  BasicInfoSection,
  DiscountSection,
  ValiditySection,
  LimitsSection,
  ActiveToggleSection,
} from './generator/bulk-form-sections'

type BulkCouponGeneratorProps = {
  salonId: string
}

export function BulkCouponGenerator({ salonId }: BulkCouponGeneratorProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState({
    prefix: 'SAVE',
    description: 'Seasonal promotion',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 10,
    count: 10,
    valid_from: '',
    valid_until: '',
    is_active: true,
    min_purchase_amount: null as number | null,
    max_discount_amount: null as number | null,
  })

  const updateFormState = (updates: Partial<typeof formState>) => {
    setFormState({ ...formState, ...updates })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    toast({
      title: 'Coupons unavailable',
      description: COUPONS_UNSUPPORTED_MESSAGE,
      variant: 'destructive',
    })
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Coupon Generator</CardTitle>
        <CardDescription>Create batches of coupons for marketing campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldSet className="flex flex-col gap-6">
            <BasicInfoSection formState={formState} onChange={updateFormState} />
            <DiscountSection formState={formState} onChange={updateFormState} />
            <ValiditySection formState={formState} onChange={updateFormState} />
            <LimitsSection formState={formState} onChange={updateFormState} />
            <ActiveToggleSection formState={formState} onChange={updateFormState} />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>{`Generate ${formState.count} Coupons`}</span>
              )}
            </Button>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
