'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'

// UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const updateMediaSchema = z.object({
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  logo_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  video_url: z.string().url().optional(),
  brand_colors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
  }).optional(),
})

const addImageSchema = z.object({
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  imageUrl: z.string().url('Invalid image URL'),
})

const removeImageSchema = z.object({
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  imageUrl: z.string().url('Invalid image URL'),
})

export async function updateSalonMedia(formData: FormData) {
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const salonId = formData.get('salonId') as string
    const logo_url = formData.get('logo_url') as string | null
    const cover_image_url = formData.get('cover_image_url') as string | null
    const video_url = formData.get('video_url') as string | null
    const brand_colors = formData.get('brand_colors') as string | null

    let brandColorsData: string[] | undefined
    if (brand_colors) {
      try {
        const parsed = JSON.parse(brand_colors)
        brandColorsData = Array.isArray(parsed) ? parsed.filter((c): c is string => typeof c === 'string') : undefined
      } catch {
        return { error: 'Invalid brand colors format' }
      }
    }

    const validation = updateMediaSchema.safeParse({
      salonId,
      logo_url: logo_url || undefined,
      cover_image_url: cover_image_url || undefined,
      video_url: video_url || undefined,
      brand_colors: brandColorsData,
    })

    if (!validation.success) {
      return { error: validation.error.issues[0]?.message ?? 'Validation failed' }
    }

    // Verify ownership
    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized' }
    }

    const { error } = await supabase
      .schema('organization')
      .from('salon_media')
      .upsert({
        salon_id: salonId,
        logo_url: logo_url || null,
        cover_image_url: cover_image_url || null,
        video_url: video_url || null,
        brand_colors: brandColorsData || null,
      })

    if (error) throw error

    revalidatePath('/business/settings/media')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update media' }
  }
}

export async function addGalleryImage(formData: FormData) {
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const salonId = formData.get('salonId') as string
    const imageUrl = formData.get('imageUrl') as string

    const validation = addImageSchema.safeParse({ salonId, imageUrl })
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message ?? 'Validation failed' }
    }

    // Verify ownership
    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized' }
    }

    // Get current gallery
    const { data: media } = await supabase
      .schema('organization')
      .from('salon_media')
      .select('gallery_urls')
      .eq('salon_id', salonId)
      .single<{ gallery_urls: string[] | null }>()

    const currentGallery = media?.gallery_urls || []
    const updatedGallery = [...currentGallery, imageUrl]

    const { error } = await supabase
      .schema('organization')
      .from('salon_media')
      .upsert({
        salon_id: salonId,
        gallery_urls: updatedGallery,
      })

    if (error) throw error

    revalidatePath('/business/settings/media')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to add image' }
  }
}

export async function removeGalleryImage(formData: FormData) {
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const salonId = formData.get('salonId') as string
    const imageUrl = formData.get('imageUrl') as string

    const validation = removeImageSchema.safeParse({ salonId, imageUrl })
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message ?? 'Validation failed' }
    }

    // Verify ownership
    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized' }
    }

    // Get current gallery
    const { data: media } = await supabase
      .schema('organization')
      .from('salon_media')
      .select('gallery_urls')
      .eq('salon_id', salonId)
      .single<{ gallery_urls: string[] | null }>()

    const currentGallery = media?.gallery_urls || []
    const updatedGallery = currentGallery.filter((url: string) => url !== imageUrl)

    const { error } = await supabase
      .schema('organization')
      .from('salon_media')
      .update({
        gallery_urls: updatedGallery,
      })
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/settings/media')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to remove image' }
  }
}
