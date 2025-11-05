'use client'

import { useState, useRef, useEffect } from 'react'

import {
  updateProfileMetadata,
  type ProfileMetadataInput,
} from '@/features/shared/profile-metadata/api/mutations'
import { SOCIAL_PROFILE_FIELDS, type SocialProfileKey } from '../components/constants'
import type { Database } from '@/lib/types/database.types'
import { TIME_MS } from '@/lib/config/constants'
import { hasKeys } from '@/lib/utils/typed-object'
import { useImageUploads } from './use-image-uploads'
import { useArrayItems } from './use-array-items'

type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row']

type UseMetadataFormParams = {
  metadata: ProfileMetadata | null
}

type SocialProfiles = Partial<Record<SocialProfileKey, string>>

export function useMetadataForm({ metadata }: UseMetadataFormParams) {
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

  const notifySuccess = () => {
    setSuccess(true)
    // ASYNC FIX: Store timer ref and clear previous timer to prevent multiple timers
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current)
    }
    successTimerRef.current = setTimeout(() => setSuccess(false), TIME_MS.SUCCESS_MESSAGE_TIMEOUT)
  }

  // Use extracted hooks for image uploads and array items
  const imageUploads = useImageUploads({
    initialAvatarUrl: metadata?.avatar_url || '',
    initialCoverUrl: metadata?.cover_image_url || '',
    onSuccess: notifySuccess,
    onError: setError,
  })

  const interests = useArrayItems(metadata?.interests || [])
  const tags = useArrayItems(metadata?.tags || [])

  // Safely cast social_profiles from JSON field with validation
  const socialProfiles: SocialProfiles =
    metadata?.social_profiles &&
    typeof metadata.social_profiles === 'object' &&
    !Array.isArray(metadata.social_profiles)
      ? (metadata.social_profiles as SocialProfiles)
      : {}

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(event.currentTarget)
    const updatedSocialProfiles: SocialProfiles = {}

    SOCIAL_PROFILE_FIELDS.forEach(({ key }: { key: SocialProfileKey }) => {
      const value = (formData.get(`social_${key}`) as string) || ''
      if (value) {
        updatedSocialProfiles[key] = value
      }
    })

    const input: ProfileMetadataInput = {
      avatar_url: imageUploads.avatarUrl || null,
      cover_image_url: imageUploads.coverUrl || null,
      social_profiles:
        hasKeys(updatedSocialProfiles) ? updatedSocialProfiles : null,
      interests: interests.items.length > 0 ? interests.items : null,
      tags: tags.items.length > 0 ? tags.items : null,
    }

    const result = await updateProfileMetadata(input)

    if (result.success) {
      notifySuccess()
    } else {
      setError(result.error)
    }

    setIsSubmitting(false)
  }

  return {
    avatarUrl: imageUploads.avatarUrl,
    coverUrl: imageUploads.coverUrl,
    interests: interests.items,
    tags: tags.items,
    isSubmitting,
    isUploadingAvatar: imageUploads.isUploadingAvatar,
    isUploadingCover: imageUploads.isUploadingCover,
    error,
    success,
    socialProfiles,
    handleAvatarUpload: imageUploads.handleAvatarUpload,
    handleCoverUpload: imageUploads.handleCoverUpload,
    handleSubmit,
    handleAddInterest: interests.addItem,
    handleRemoveInterest: interests.removeItem,
    handleAddTag: tags.addItem,
    handleRemoveTag: tags.removeItem,
  }
}
