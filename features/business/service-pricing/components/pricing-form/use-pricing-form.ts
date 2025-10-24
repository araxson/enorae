'use client'

import { useEffect, useMemo, useState } from 'react'

import { upsertServicePricing } from '@/features/business/service-pricing/api/mutations'
import type { ServicePricingWithService } from '@/features/business/service-pricing/api/queries'

const DEFAULT_FORM_STATE = {
  serviceId: '',
  basePrice: '',
  salePrice: '',
  cost: '',
  taxRate: '',
  isTaxable: true,
  commissionRate: '',
  currencyCode: 'USD',
}

export type PricingFormState = typeof DEFAULT_FORM_STATE

export type PricingFormHookResult = {
  state: PricingFormState
  loading: boolean
  profitMargin: string
  actions: {
    setField: <Key extends keyof PricingFormState>(field: Key, value: PricingFormState[Key]) => void
    reset: () => void
  }
  handlers: {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<{ success?: boolean; error?: string }>
  }
}

type UsePricingFormParams = {
  open: boolean
  editPricing?: ServicePricingWithService | null
}

export function usePricingForm({ open, editPricing }: UsePricingFormParams): PricingFormHookResult {
  const [formState, setFormState] = useState<PricingFormState>(DEFAULT_FORM_STATE)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    if (editPricing) {
      setFormState({
        serviceId: editPricing.service_id ?? '',
        basePrice: editPricing.base_price?.toString() ?? '',
        salePrice: editPricing.sale_price?.toString() ?? '',
        cost: editPricing.cost?.toString() ?? '',
        taxRate: editPricing.tax_rate?.toString() ?? '',
        isTaxable: editPricing.is_taxable ?? true,
        commissionRate: editPricing.commission_rate?.toString() ?? '',
        currencyCode: editPricing.currency_code ?? 'USD',
      })
    } else {
      setFormState(DEFAULT_FORM_STATE)
    }
  }, [open, editPricing])

  const setField = <Key extends keyof PricingFormState>(field: Key, value: PricingFormState[Key]) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const reset = () => setFormState(DEFAULT_FORM_STATE)

  const profitMargin = useMemo(() => {
    const price = parseFloat(formState.salePrice || formState.basePrice)
    const cost = parseFloat(formState.cost)

    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(cost) || cost <= 0) {
      return '0'
    }

    const margin = ((price - cost) / price) * 100
    return margin.toFixed(1)
  }, [formState.basePrice, formState.salePrice, formState.cost])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      const payload = new FormData()

      if (editPricing?.id) {
        payload.append('id', editPricing.id)
      }

      payload.append('serviceId', formState.serviceId)
      payload.append('basePrice', formState.basePrice)
      payload.append('isTaxable', formState.isTaxable.toString())
      payload.append('currencyCode', formState.currencyCode)

      if (formState.salePrice) payload.append('salePrice', formState.salePrice)
      if (formState.cost) payload.append('cost', formState.cost)
      if (formState.taxRate) payload.append('taxRate', formState.taxRate)
      if (formState.commissionRate) payload.append('commissionRate', formState.commissionRate)

      const result = await upsertServicePricing(payload)
      return result
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to save service pricing',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    state: formState,
    loading,
    profitMargin,
    actions: {
      setField,
      reset,
    },
    handlers: {
      handleSubmit,
    },
  }
}
