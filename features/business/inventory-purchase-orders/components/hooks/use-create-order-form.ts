'use client'

import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { createPurchaseOrder } from '../../api/mutations'
import type { Product, OrderItem } from '../types'
import { calculateOrderTotal, createEmptyOrderItem, mapProductToOrderItem } from '../utils/order-calculations'

type UseCreateOrderFormParams = {
  products: Product[]
  onClose: () => void
  onSuccess?: () => void
}

type UseCreateOrderFormReturn = {
  items: OrderItem[]
  isSubmitting: boolean
  totalAmount: number
  handleAddItem: () => void
  handleRemoveItem: (index: number) => void
  handleUpdateItem: (index: number, field: keyof OrderItem, value: unknown) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

const applyQuantity = (value: unknown) => {
  if (typeof value === 'number') return Math.max(1, value)
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.max(1, Math.floor(parsed)) : 1
}

const applyUnitPrice = (value: unknown) => {
  if (typeof value === 'number') return Math.max(0, value)
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function useCreateOrderForm({
  products,
  onClose,
  onSuccess,
}: UseCreateOrderFormParams): UseCreateOrderFormReturn {
  const [items, setItems] = useState<OrderItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalAmount = useMemo(() => calculateOrderTotal(items), [items])

  const handleAddItem = useCallback(() => {
    setItems((previous) => [...previous, createEmptyOrderItem()])
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    setItems((previous) => previous.filter((_, itemIndex) => itemIndex !== index))
  }, [])

  const handleUpdateItem = useCallback(
    (index: number, field: keyof OrderItem, value: unknown) => {
      setItems((previous) => {
        const nextItems = [...previous]
        const target = nextItems[index]

        if (!target) {
          return previous
        }

        if (field === 'productId') {
          const product = products.find((candidate) => candidate.id === value)
          nextItems[index] = mapProductToOrderItem(product, target)
          return nextItems
        }

        if (field === 'quantity') {
          nextItems[index] = {
            ...target,
            quantity: applyQuantity(value),
          }
          return nextItems
        }

        if (field === 'unitPrice') {
          nextItems[index] = {
            ...target,
            unitPrice: applyUnitPrice(value),
          }
          return nextItems
        }

        nextItems[index] = {
          ...target,
          [field]: String(value ?? ''),
        }

        return nextItems
      })
    },
    [products]
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsSubmitting(true)

      const formData = new FormData(event.currentTarget)
      formData.set('items', JSON.stringify(items))

      const result = await createPurchaseOrder(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Purchase order created successfully')
        setItems([])
        onClose()
        onSuccess?.()
      }

      setIsSubmitting(false)
    },
    [items, onClose, onSuccess]
  )

  return {
    items,
    isSubmitting,
    totalAmount,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleSubmit,
  }
}
