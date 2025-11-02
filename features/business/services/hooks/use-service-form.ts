'use client'

import { useEffect, useState } from 'react'

import { createService, updateService } from '@/features/business/services/api/mutations'
import type { Database } from '@/lib/types/database.types'

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

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [duration, setDuration] = useState('')
  const [buffer, setBuffer] = useState('0')
  const [isTaxable, setIsTaxable] = useState(true)
  const [taxRate, setTaxRate] = useState('')
  const [commissionRate, setCommissionRate] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isBookable, setIsBookable] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  useEffect(() => {
    if (service) {
      setName(service['name'] || '')
      setDescription(service['description'] || '')
      setBasePrice(service['price']?.toString() || '')
      setSalePrice(service['sale_price']?.toString() || '')
      setDuration(service['duration_minutes']?.toString() || '')
      setBuffer(service['buffer_minutes']?.toString() || '0')
      setIsTaxable(true)
      setTaxRate('')
      setCommissionRate('')
      setIsActive(service['is_active'] ?? true)
      setIsBookable(service['is_bookable'] ?? true)
      setIsFeatured(service['is_featured'] ?? false)
    } else {
      setName('')
      setDescription('')
      setBasePrice('')
      setSalePrice('')
      setDuration('')
      setBuffer('0')
      setIsTaxable(true)
      setTaxRate('')
      setCommissionRate('')
      setIsActive(true)
      setIsBookable(true)
      setIsFeatured(false)
    }
    setError(null)
  }, [service, open])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

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
      isSubmitting,
      error,
    },
    actions: {
      setName,
      setDescription,
      setBasePrice,
      setSalePrice,
      setDuration,
      setBuffer,
      setIsTaxable,
      setTaxRate,
      setCommissionRate,
      setIsActive,
      setIsBookable,
      setIsFeatured,
    },
    handlers: {
      handleSubmit,
      handleClose: onClose,
    },
  }
}

export type ServiceFormHook = ReturnType<typeof useServiceForm>
