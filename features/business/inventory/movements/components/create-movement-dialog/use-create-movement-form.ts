'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { MovementType } from './types'
import { createStockMovement } from '../../api/mutations'

type UseCreateMovementFormParams = {
  onClose: () => void
}

const defaultState = {
  movementType: 'adjustment' as MovementType,
  productId: '',
  locationId: '',
  fromLocationId: '',
  toLocationId: '',
}

export function useCreateMovementForm({ onClose }: UseCreateMovementFormParams) {
  const [state, setState] = useState(defaultState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setStateValue = <Key extends keyof typeof defaultState>(key: Key, value: typeof defaultState[Key]) => {
    setState((current) => ({ ...current, [key]: value }))
  }

  const resetForm = () => {
    setState(defaultState)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    formData.append('movementType', state.movementType)
    formData.append('productId', state.productId)

    if (state.movementType === 'transfer') {
      formData.append('locationId', state.fromLocationId)
      formData.append('fromLocationId', state.fromLocationId)
      formData.append('toLocationId', state.toLocationId)
    } else {
      formData.append('locationId', state.locationId)
      if (state.movementType === 'in' || state.movementType === 'return') {
        formData.append('toLocationId', state.locationId)
      } else if (['out', 'damage', 'theft'].includes(state.movementType)) {
        formData.append('fromLocationId', state.locationId)
      }
    }

    const result = await createStockMovement(formData)
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Stock movement recorded successfully')
      onClose()
      resetForm()
      event.currentTarget.reset()
    } else {
      toast.error(result.error || 'Failed to record movement')
    }
  }

  return {
    state,
    isSubmitting,
    setMovementType: (value: MovementType) => setStateValue('movementType', value),
    setProductId: (value: string) => setStateValue('productId', value),
    setLocationId: (value: string) => setStateValue('locationId', value),
    setFromLocationId: (value: string) => setStateValue('fromLocationId', value),
    setToLocationId: (value: string) => setStateValue('toLocationId', value),
    handleSubmit,
  }
}
