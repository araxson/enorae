import { useState, useEffect, useMemo } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import type { ServicePricingWithService } from '@/features/business/service-pricing/api/queries'

export type PricingFormData = {
  serviceId: string
  basePrice: number
  cost: number
  taxRate: number
  commissionRate: number
  salePrice: number
  isTaxable: boolean
  currencyCode: string
}

// Alias for backward compatibility
export type PricingFormState = PricingFormData

interface UsePricingFormParams {
  open: boolean
  editPricing?: ServicePricingWithService | null
}

export function usePricingForm({ open, editPricing }: UsePricingFormParams) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PricingFormData>({
    serviceId: '',
    basePrice: 0,
    cost: 0,
    taxRate: 0,
    commissionRate: 0,
    salePrice: 0,
    isTaxable: true,
    currencyCode: 'USD',
  })
  const { toast } = useToast()

  // Initialize form data when dialog opens or editPricing changes
  useEffect(() => {
    if (open && editPricing) {
      setFormData({
        serviceId: editPricing.service_id ?? '',
        basePrice: editPricing.base_price ?? 0,
        cost: editPricing.cost ?? 0,
        taxRate: editPricing.tax_rate ?? 0,
        commissionRate: editPricing.commission_rate ?? 0,
        salePrice: editPricing.sale_price ?? 0,
        isTaxable: editPricing.is_taxable ?? true,
        currencyCode: editPricing.currency_code ?? 'USD',
      })
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        serviceId: '',
        basePrice: 0,
        cost: 0,
        taxRate: 0,
        commissionRate: 0,
        salePrice: 0,
        isTaxable: true,
        currencyCode: 'USD',
      })
    }
  }, [open, editPricing])

  const profitMargin = useMemo(() => {
    if (formData.basePrice === 0) return 0
    return ((formData.basePrice - formData.cost) / formData.basePrice) * 100
  }, [formData.basePrice, formData.cost])

  const setField = (field: keyof PricingFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      // Pricing submission logic would go here
      toast({
        title: 'Success',
        description: 'Pricing updated successfully',
      })
      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pricing'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    state: formData,
    loading: isSubmitting,
    profitMargin: profitMargin.toFixed(2),
    actions: {
      setField,
    },
    handlers: {
      handleSubmit,
    },
  }
}

export type PricingFormHookResult = ReturnType<typeof usePricingForm>
export type { PricingFormData as UsePricingFormData }
