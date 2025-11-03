'use client'

import { useMemo } from 'react'

export function useCurrencyFormatter() {
  const formatCurrency = useMemo(
    () => (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    },
    []
  )

  const formatPercentage = useMemo(
    () => (value: number) => {
      return `${value.toFixed(1)}%`
    },
    []
  )

  return { formatCurrency, formatPercentage }
}
