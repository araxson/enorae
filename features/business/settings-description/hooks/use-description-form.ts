'use client'

import { useState, useRef, useEffect } from 'react'

import { updateSalonDescription, type DescriptionInput } from '@/features/business/settings-description/api/mutations'

import type { Database } from '@/lib/types/database.types'
import { TIME_MS } from '@/lib/config/constants'

type SalonDescription = Database['public']['Views']['salon_descriptions_view']['Row']

type UseDescriptionFormParams = {
  salonId: string
  description: SalonDescription | null
}

export type ArrayFieldState = {
  keywords: string[]
}

export type DescriptionFieldState = {
  short_description: string | null
  full_description: string | null
  welcome_message: string | null
  cancellation_policy: string | null
  meta_title: string | null
  meta_description: string | null
}

export type UseDescriptionFormReturn = {
  state: {
    isSubmitting: boolean
    error: string | null
    success: boolean
    arrays: ArrayFieldState
    descriptionFields: DescriptionFieldState
  }
  actions: {
    setArrayField: (field: keyof ArrayFieldState, values: string[]) => void
    setSuccess: (value: boolean) => void
  }
  handlers: {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  }
}

export function useDescriptionForm({ salonId, description }: UseDescriptionFormParams): UseDescriptionFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const successTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // ASYNC FIX: Cleanup timer on unmount to prevent state updates after unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current)
      }
    }
  }, [])

  const [arrays, setArrays] = useState<ArrayFieldState>({
    keywords: description?.['meta_keywords'] ?? [],
  })

  const descriptionFields: DescriptionFieldState = {
    short_description: description?.['short_description'] ?? null,
    full_description: description?.['full_description'] ?? null,
    welcome_message: description?.['welcome_message'] ?? null,
    cancellation_policy: description?.['cancellation_policy'] ?? null,
    meta_title: description?.['meta_title'] ?? null,
    meta_description: description?.['meta_description'] ?? null,
  }

  const setArrayField = (field: keyof ArrayFieldState, values: string[]) => {
    setArrays((prev) => ({ ...prev, [field]: values }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(event.currentTarget)

    const input: DescriptionInput = {
      short_description: (formData.get('short_description') as string) || null,
      full_description: (formData.get('full_description') as string) || null,
      welcome_message: (formData.get('welcome_message') as string) || null,
      cancellation_policy: (formData.get('cancellation_policy') as string) || null,
      meta_title: (formData.get('meta_title') as string) || null,
      meta_description: (formData.get('meta_description') as string) || null,
      meta_keywords: arrays.keywords.length > 0 ? arrays.keywords : null,
    }

    const result = await updateSalonDescription(salonId, input)

    if (result.success) {
      setSuccess(true)
      // ASYNC FIX: Store timer ref and clear previous timer to prevent multiple timers
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current)
      }
      successTimerRef.current = setTimeout(() => setSuccess(false), TIME_MS.SUCCESS_MESSAGE_TIMEOUT)
    } else {
      setError(result.error ?? 'Unable to update description')
    }

    setIsSubmitting(false)
  }

  return {
    state: {
      isSubmitting,
      error,
      success,
      arrays,
      descriptionFields,
    },
    actions: {
      setArrayField,
      setSuccess,
    },
    handlers: {
      handleSubmit,
    },
  }
}
