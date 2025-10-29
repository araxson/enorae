'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DEFAULT_BRAND_COLORS } from '@/lib/constants/brand-defaults'

import { addGalleryImage, removeGalleryImage, updateSalonMedia } from '@/features/business/media/api/mutations'
import type { SalonMedia as SalonMediaRow } from '@/features/business/locations'

type SalonMedia = SalonMediaRow

type BrandColors = { primary: string; secondary: string; accent: string }
type SocialLinks = {
  facebook: string
  instagram: string
  twitter: string
  tiktok: string
  website: string
}

type UseMediaFormParams = {
  media: SalonMedia | null
}

const DEFAULT_BRAND_COLORS_CONFIG: BrandColors = {
  primary: DEFAULT_BRAND_COLORS.PRIMARY,
  secondary: DEFAULT_BRAND_COLORS.SECONDARY,
  accent: DEFAULT_BRAND_COLORS.ACCENT,
}

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: '',
  instagram: '',
  twitter: '',
  tiktok: '',
  website: '',
}

export function useMediaForm({ media }: UseMediaFormParams) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingImage, setIsAddingImage] = useState(false)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  const [galleryUrls, setGalleryUrls] = useState<string[]>(media?.['gallery_urls'] || [])

  const brandColors = useMemo<BrandColors>(() => {
    const parsed = media?.['brand_colors'] as BrandColors | null
    return {
      ...DEFAULT_BRAND_COLORS_CONFIG,
      ...(parsed || {}),
    }
  }, [media?.['brand_colors']])

  const socialLinks = useMemo<SocialLinks>(() => {
    const parsed = media?.['social_links'] as SocialLinks | null
    return {
      ...DEFAULT_SOCIAL_LINKS,
      ...(parsed || {}),
    }
  }, [media?.['social_links']])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    formData.set(
      'brand_colors',
      JSON.stringify({
        primary: formData.get('brand_primary'),
        secondary: formData.get('brand_secondary'),
        accent: formData.get('brand_accent'),
      }),
    )

    formData.set(
      'social_links',
      JSON.stringify({
        facebook: formData.get('social_facebook'),
        instagram: formData.get('social_instagram'),
        twitter: formData.get('social_twitter'),
        tiktok: formData.get('social_tiktok'),
        website: formData.get('social_website'),
      }),
    )

    formData.set('gallery_urls', JSON.stringify(galleryUrls))

    const result = await updateSalonMedia(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Media updated successfully')
    }

    setIsSubmitting(false)
  }

  const handleAddImage = async () => {
    if (!newGalleryUrl.trim()) return

    setIsAddingImage(true)
    const formData = new FormData()
    formData.append('url', newGalleryUrl)

    const result = await addGalleryImage(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      setGalleryUrls((current) => [...current, newGalleryUrl])
      setNewGalleryUrl('')
      toast.success('Image added to gallery')
    }

    setIsAddingImage(false)
  }

  const handleRemoveImage = async (url: string) => {
    const formData = new FormData()
    formData.append('url', url)

    const result = await removeGalleryImage(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      setGalleryUrls((current) => current.filter((item) => item !== url))
      toast.success('Image removed from gallery')
    }
  }

  return {
    state: {
      isSubmitting,
      isAddingImage,
      newGalleryUrl,
      galleryUrls,
      brandColors,
      socialLinks,
      logoUrl: media?.['logo_url'] ?? '',
      coverImageUrl: media?.['cover_image_url'] ?? '',
    },
    actions: {
      setNewGalleryUrl,
      handleAddImage,
      handleRemoveImage,
    },
    handlers: {
      handleSubmit,
    },
  }
}
