'use client'

import { useEffect, useState } from 'react'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services_view']['Row']

type UseServiceFormStateParams = {
  service: Service | null | undefined
  open: boolean
}

export function useServiceFormState({ service, open }: UseServiceFormStateParams) {
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
  }, [service, open])

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
  }
}
