'use client'

import { useState, useRef, useEffect } from 'react'

import {
  updateProfileMetadata,
  uploadAvatarAction,
  uploadCoverImageAction,
  type ProfileMetadataInput,
} from '@/features/shared/profile-metadata/api/mutations'
import { SOCIAL_PROFILE_FIELDS, type SocialProfileKey } from '../components/constants'
import type { Database } from '@/lib/types/database.types'
import { TIME_MS } from '@/lib/config/constants'
import { hasKeys } from '@/lib/utils/typed-object'

type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row']

type UseMetadataFormParams = {
  metadata: ProfileMetadata | null
}

type SocialProfiles = Partial<Record<SocialProfileKey, string>>

export function useMetadataForm({ metadata }: UseMetadataFormParams) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [avatarUrl, setAvatarUrl] = useState(metadata?.avatar_url || '')
  const [coverUrl, setCoverUrl] = useState(metadata?.cover_image_url || '')
  const [interests, setInterests] = useState<string[]>(metadata?.interests || [])
  const [tags, setTags] = useState<string[]>(metadata?.tags || [])

  // Safely cast social_profiles from JSON field with validation
  const socialProfiles: SocialProfiles =
    metadata?.social_profiles &&
    typeof metadata.social_profiles === 'object' &&
    !Array.isArray(metadata.social_profiles)
      ? (metadata.social_profiles as SocialProfiles)
      : {}
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

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return

    setIsUploadingAvatar(true)
    setError(null)

    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatarAction(formData)

    if (result.success) {
      setAvatarUrl(result.data.url)
      notifySuccess()
    } else {
      setError(result.error)
    }

    setIsUploadingAvatar(false)
  }

  const handleCoverUpload = async (file: File | null) => {
    if (!file) return

    setIsUploadingCover(true)
    setError(null)

    const formData = new FormData()
    formData.append('cover', file)

    const result = await uploadCoverImageAction(formData)

    if (result.success) {
      setCoverUrl(result.data.url)
      notifySuccess()
    } else {
      setError(result.error)
    }

    setIsUploadingCover(false)
  }

  const addItem = (value: string, items: string[], setter: (values: string[]) => void) => {
    const trimmed = value.trim()
    if (!trimmed || items.includes(trimmed)) return

    setter([...items, trimmed])
  }

  const removeItem = (index: number, items: string[], setter: (values: string[]) => void) => {
    setter(items.filter((_, itemIndex) => itemIndex !== index))
  }

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
      avatar_url: avatarUrl || null,
      cover_image_url: coverUrl || null,
      social_profiles:
        hasKeys(updatedSocialProfiles) ? updatedSocialProfiles : null,
      interests: interests.length > 0 ? interests : null,
      tags: tags.length > 0 ? tags : null,
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
    avatarUrl,
    coverUrl,
    interests,
    tags,
    isSubmitting,
    isUploadingAvatar,
    isUploadingCover,
    error,
    success,
    socialProfiles,
    handleAvatarUpload,
    handleCoverUpload,
    handleSubmit,
    handleAddInterest: (value: string) => addItem(value, interests, setInterests),
    handleRemoveInterest: (index: number) => removeItem(index, interests, setInterests),
    handleAddTag: (value: string) => addItem(value, tags, setTags),
    handleRemoveTag: (index: number) => removeItem(index, tags, setTags),
  }
}
