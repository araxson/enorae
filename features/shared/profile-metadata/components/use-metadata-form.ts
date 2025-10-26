'use client'

import { useState } from 'react'

import {
  updateProfileMetadata,
  uploadAvatar,
  uploadCoverImage,
  type ProfileMetadataInput,
} from '@/features/shared/profile-metadata/api/mutations'
import { SOCIAL_PROFILE_FIELDS, type SocialProfileKey } from './constants'
import type { Database } from '@/lib/types/database.types'

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

  const socialProfiles = (metadata?.social_profiles as SocialProfiles) || {}

  const notifySuccess = () => {
    setSuccess(true)
    const SUCCESS_MESSAGE_TIMEOUT = 3000 // 3 seconds
    setTimeout(() => setSuccess(false), SUCCESS_MESSAGE_TIMEOUT)
  }

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return

    setIsUploadingAvatar(true)
    setError(null)

    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatar(formData)

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

    const result = await uploadCoverImage(formData)

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

    SOCIAL_PROFILE_FIELDS.forEach(({ key }) => {
      const value = (formData.get(`social_${key}`) as string) || ''
      if (value) {
        updatedSocialProfiles[key] = value
      }
    })

    const input: ProfileMetadataInput = {
      avatar_url: avatarUrl || null,
      cover_image_url: coverUrl || null,
      social_profiles:
        Object.keys(updatedSocialProfiles).length > 0 ? updatedSocialProfiles : null,
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
