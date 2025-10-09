'use client'

import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { receivePurchaseOrderItems, updatePurchaseOrderStatus } from '../../api/mutations'
import type { PurchaseOrderWithDetails } from '../../api/queries'

type UseOrderDetailParams = {
  order: PurchaseOrderWithDetails
  onClose: (open: boolean) => void
}

const computeHasUnreceivedItems = (order: PurchaseOrderWithDetails) =>
  order.items?.some((item) => {
    const received = item.quantity_received ?? 0
    const orderedQuantity = item.quantity_ordered ?? 0
    return received < orderedQuantity
  }) ?? false

const buildItemPayload = (
  order: PurchaseOrderWithDetails,
  receivingQuantities: Record<string, number>
) =>
  order.items?.map((item) => ({
    id: item.id!,
    quantityReceived: receivingQuantities[item.id!] ?? item.quantity_received ?? 0,
  })) ?? []

type UseOrderDetailReturn = {
  currentStatus: string
  isUpdating: boolean
  isReceiving: boolean
  receivingQuantities: Record<string, number>
  canReceiveItems: boolean
  hasUnreceivedItems: boolean
  handleStatusChange: (status: string) => Promise<void>
  handleQuantityChange: (itemId: string, quantity: number) => void
  handleReceiveItems: () => Promise<void>
}

export function useOrderDetail({ order, onClose }: UseOrderDetailParams): UseOrderDetailReturn {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isReceiving, setIsReceiving] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(order.status || 'pending')
  const [receivingQuantities, setReceivingQuantities] = useState<Record<string, number>>({})

  const canReceiveItems = currentStatus === 'ordered' || currentStatus === 'approved'

  const hasUnreceivedItems = useMemo(() => computeHasUnreceivedItems(order), [order])

  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      setIsUpdating(true)
      const formData = new FormData()
      formData.append('id', order.id || '')
      formData.append('status', newStatus)

      try {
        const result = await updatePurchaseOrderStatus(formData)
        if (result.error) {
          toast.error(result.error)
        } else {
          setCurrentStatus(newStatus)
          toast.success('Order status updated')
        }
      } catch {
        toast.error('Failed to update status')
      } finally {
        setIsUpdating(false)
      }
    },
    [order.id]
  )

  const handleQuantityChange = useCallback((itemId: string, quantity: number) => {
    setReceivingQuantities((previous) => ({
      ...previous,
      [itemId]: quantity,
    }))
  }, [])

  const handleReceiveItems = useCallback(async () => {
    if (!order.id || !order.items) {
      return
    }

    setIsReceiving(true)
    const formData = new FormData()
    formData.append('orderId', order.id)

    const items = buildItemPayload(order, receivingQuantities)
    formData.append('items', JSON.stringify(items))

    try {
      const result = await receivePurchaseOrderItems(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        setReceivingQuantities({})
        toast.success('Items received')
        onClose(false)
      }
    } catch {
      toast.error('Failed to receive items')
    } finally {
      setIsReceiving(false)
    }
  }, [order, receivingQuantities, onClose])

  return {
    currentStatus,
    isUpdating,
    isReceiving,
    receivingQuantities,
    canReceiveItems,
    hasUnreceivedItems,
    handleStatusChange,
    handleQuantityChange,
    handleReceiveItems,
  }
}
