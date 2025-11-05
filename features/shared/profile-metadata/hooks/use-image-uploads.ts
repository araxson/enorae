'use client'

import { useState } from 'react'
import {
  uploadAvatarAction,
  uploadCoverImageAction,
} from '@/features/shared/profile-metadata/api/mutations'

type UseImageUploadsParams = {
  initialAvatarUrl?: string
  initialCoverUrl?: string
  onSuccess: () => void
  onError: (error: string) => void
}

export function useImageUploads({
  initialAvatarUrl = '',
  initialCoverUrl = '',
  onSuccess,
  onError,
}: UseImageUploadsParams) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return

    setIsUploadingAvatar(true)

    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatarAction(formData)

    if (result.success) {
      setAvatarUrl(result.data.url)
      onSuccess()
    } else {
      onError(result.error)
    }

    setIsUploadingAvatar(false)
  }

  const handleCoverUpload = async (file: File | null) => {
    if (!file) return

    setIsUploadingCover(true)

    const formData = new FormData()
    formData.append('cover', file)

    const result = await uploadCoverImageAction(formData)

    if (result.success) {
      setCoverUrl(result.data.url)
      onSuccess()
    } else {
      onError(result.error)
    }

    setIsUploadingCover(false)
  }

  return {
    avatarUrl,
    coverUrl,
    isUploadingAvatar,
    isUploadingCover,
    handleAvatarUpload,
    handleCoverUpload,
    setAvatarUrl,
    setCoverUrl,
  }
}
