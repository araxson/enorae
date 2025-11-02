'use client'

import { useState, useRef, useEffect } from 'react'

import { updateSalonContactDetails, type ContactDetailsInput } from '@/features/business/settings-contact/api/mutations'

import type { Database } from '@/lib/types/database.types'
import { TIME_MS } from '@/lib/config/constants'

type SalonContactDetails = Database['public']['Views']['salon_contact_details_view']['Row']

type UseContactFormParams = {
  salonId: string
  contactDetails: SalonContactDetails | null
}

type UseContactFormReturn = {
  state: {
    isSubmitting: boolean
    error: string | null
    success: boolean
    initialValues: ContactDetailsInput
  }
  handlers: {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
    resetSuccess: () => void
  }
}

export function useContactForm({ salonId, contactDetails }: UseContactFormParams): UseContactFormReturn {
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

  const initialValues: ContactDetailsInput = {
    primary_phone: contactDetails?.['primary_phone'] ?? null,
    secondary_phone: contactDetails?.['secondary_phone'] ?? null,
    primary_email: contactDetails?.['primary_email'] ?? null,
    booking_email: contactDetails?.['booking_email'] ?? null,
    website_url: contactDetails?.['website_url'] ?? null,
    booking_url: contactDetails?.['booking_url'] ?? null,
    facebook_url: contactDetails?.['facebook_url'] ?? null,
    instagram_url: contactDetails?.['instagram_url'] ?? null,
    twitter_url: contactDetails?.['twitter_url'] ?? null,
    tiktok_url: contactDetails?.['tiktok_url'] ?? null,
    linkedin_url: contactDetails?.['linkedin_url'] ?? null,
    youtube_url: contactDetails?.['youtube_url'] ?? null,
    whatsapp_number: contactDetails?.['whatsapp_number'] ?? null,
    telegram_username: contactDetails?.['telegram_username'] ?? null,
    hours_display_text: contactDetails?.['hours_display_text'] ?? null,
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(event.currentTarget)

    const input: ContactDetailsInput = {
      primary_phone: (formData.get('primary_phone') as string) || null,
      secondary_phone: (formData.get('secondary_phone') as string) || null,
      primary_email: (formData.get('primary_email') as string) || null,
      booking_email: (formData.get('booking_email') as string) || null,
      website_url: (formData.get('website_url') as string) || null,
      booking_url: (formData.get('booking_url') as string) || null,
      facebook_url: (formData.get('facebook_url') as string) || null,
      instagram_url: (formData.get('instagram_url') as string) || null,
      twitter_url: (formData.get('twitter_url') as string) || null,
      tiktok_url: (formData.get('tiktok_url') as string) || null,
      linkedin_url: (formData.get('linkedin_url') as string) || null,
      youtube_url: (formData.get('youtube_url') as string) || null,
      whatsapp_number: (formData.get('whatsapp_number') as string) || null,
      telegram_username: (formData.get('telegram_username') as string) || null,
      hours_display_text: (formData.get('hours_display_text') as string) || null,
    }

    const result = await updateSalonContactDetails(salonId, input)

    if (result.success) {
      setSuccess(true)
      // ASYNC FIX: Store timer ref and clear previous timer to prevent multiple timers
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current)
      }
      successTimerRef.current = setTimeout(() => setSuccess(false), TIME_MS.SUCCESS_MESSAGE_TIMEOUT)
    } else {
      setError(result.error ?? 'Unable to update contact details')
    }

    setIsSubmitting(false)
  }

  return {
    state: {
      isSubmitting,
      error,
      success,
      initialValues,
    },
    handlers: {
      handleSubmit,
      resetSuccess: () => setSuccess(false),
    },
  }
}
