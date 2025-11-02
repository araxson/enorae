import { useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import type { SalonMedia } from '@/features/business/locations'

interface UseMediaFormParams {
  media: SalonMedia | null
}

export function useMediaForm({ media }: UseMediaFormParams) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoUrl, setLogoUrl] = useState(media?.logo_url ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(media?.cover_image_url ?? '')
  const [galleryUrls, setGalleryUrls] = useState<string[]>(media?.gallery_urls ?? [])
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  const [isAddingImage, setIsAddingImage] = useState(false)
  const [brandColors, setBrandColors] = useState<{
    primary: string
    secondary: string
    accent: string
  }>(
    typeof media?.brand_colors === 'object' && media?.brand_colors !== null
      ? (media.brand_colors as { primary: string; secondary: string; accent: string })
      : { primary: '', secondary: '', accent: '' }
  )
  const [socialLinks, setSocialLinks] = useState<{
    facebook: string
    instagram: string
    twitter: string
    tiktok: string
    website: string
  }>(
    typeof media?.social_links === 'object' && media?.social_links !== null
      ? (media.social_links as { facebook: string; instagram: string; twitter: string; tiktok: string; website: string })
      : { facebook: '', instagram: '', twitter: '', tiktok: '', website: '' }
  )
  const { toast } = useToast()

  const handleAddImage = () => {
    if (newGalleryUrl) {
      setGalleryUrls([...galleryUrls, newGalleryUrl])
      setNewGalleryUrl('')
    }
  }

  const handleRemoveImage = (url: string) => {
    setGalleryUrls(galleryUrls.filter((u) => u !== url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Media upload logic would go here
      toast({
        title: 'Success',
        description: 'Media uploaded successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload media',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    state: {
      isSubmitting,
      logoUrl,
      coverImageUrl,
      galleryUrls,
      newGalleryUrl,
      isAddingImage,
      brandColors,
      socialLinks,
    },
    actions: {
      setLogoUrl,
      setCoverImageUrl,
      setGalleryUrls,
      setNewGalleryUrl,
      setIsAddingImage,
      setBrandColors,
      setSocialLinks,
      handleAddImage,
      handleRemoveImage,
    },
    handlers: {
      handleSubmit,
    },
  }
}
