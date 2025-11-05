'use client'

import { useState } from 'react'

import { createService, updateService } from '@/features/business/services/api/mutations'
import type { Database } from '@/lib/types/database.types'
import { useServiceFormState } from './use-service-form-state'

type Service = Database['public']['Views']['services_view']['Row']

type UseServiceFormParams = {
  salonId: string
  service: Service | null | undefined
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function useServiceForm({ salonId, service, open, onClose, onSuccess }: UseServiceFormParams) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formState = useServiceFormState({ service, open })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const {
      name,
      description,
      basePrice,
      salePrice,
      duration,
      buffer,
      isTaxable,
      taxRate,
      commissionRate,
      isActive,
      isBookable,
      isFeatured,
    } = formState.state

    try {
      if (service) {
        await updateService(
          service['id'] as string,
          {
            name,
            description: description || undefined,
            is_active: isActive,
            is_bookable: isBookable,
            is_featured: isFeatured,
          },
          {
            base_price: parseFloat(basePrice),
            sale_price: salePrice ? parseFloat(salePrice) : undefined,
            currency_code: 'USD',
            is_taxable: isTaxable,
            tax_rate: taxRate ? parseFloat(taxRate) : undefined,
            commission_rate: commissionRate ? parseFloat(commissionRate) : undefined,
          },
          {
            duration_minutes: parseInt(duration, 10),
            buffer_minutes: parseInt(buffer, 10) || 0,
          },
        )
      } else {
        await createService(
          salonId,
          {
            name,
            description: description || undefined,
            is_active: isActive,
            is_bookable: isBookable,
            is_featured: isFeatured,
          },
          {
            base_price: parseFloat(basePrice),
            sale_price: salePrice ? parseFloat(salePrice) : undefined,
            currency_code: 'USD',
            is_taxable: isTaxable,
            tax_rate: taxRate ? parseFloat(taxRate) : undefined,
            commission_rate: commissionRate ? parseFloat(commissionRate) : undefined,
          },
          {
            duration_minutes: parseInt(duration, 10),
            buffer_minutes: parseInt(buffer, 10) || 0,
          },
        )
      }

      onSuccess?.()
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save service')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    state: {
      ...formState.state,
      isSubmitting,
      error,
    },
    actions: formState.actions,
    handlers: {
      handleSubmit,
      handleClose: onClose,
    },
  }
}

export type ServiceFormHook = ReturnType<typeof useServiceForm>
