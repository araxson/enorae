'use server'

import { z } from 'zod'
import { UUID_REGEX } from '@/lib/validations/shared'
import { safeJsonParseStringArray } from '@/lib/utils/safe-json'

const brandColorsSchema = z.array(z.string())

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

export type UpdateMediaValidation = z.infer<typeof updateMediaSchema>

export function validateUpdateMedia(data: {
  salonId: string
  logo_url?: string | null
  cover_image_url?: string | null
  video_url?: string | null
  brand_colors?: string | null
}): { success: true; data: UpdateMediaValidation } | { success: false; error: string } {
  // Validate brand colors if provided
  let brandColorsData: string[] | undefined
  if (data.brand_colors) {
    const parsed = safeJsonParseStringArray(data.brand_colors, [])
    const validated = brandColorsSchema.safeParse(parsed)
    brandColorsData = validated.success ? validated.data : undefined
    if (!validated.success) {
      return {
        success: false,
        error: `Brand colors validation failed: ${validated.error.issues.map((i) => i.message).join(', ')}`,
      }
    }
  }

  const validation = updateMediaSchema.safeParse({
    salonId: data.salonId,
    logo_url: data.logo_url || undefined,
    cover_image_url: data.cover_image_url || undefined,
    video_url: data.video_url || undefined,
    brand_colors: brandColorsData,
  })

  if (!validation.success) {
    const errors = validation.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    return { success: false, error: `Media validation failed: ${errors}` }
  }

  return { success: true, data: validation.data }
}

export function validateAddImage(data: {
  salonId: string
  imageUrl: string
}): { success: true } | { success: false; error: string } {
  const validation = addImageSchema.safeParse(data)
  if (!validation.success) {
    const errors = validation.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    return { success: false, error: `Validation failed: ${errors}` }
  }
  return { success: true }
}

export function validateRemoveImage(data: {
  salonId: string
  imageUrl: string
}): { success: true } | { success: false; error: string } {
  const validation = removeImageSchema.safeParse(data)
  if (!validation.success) {
    const errors = validation.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    return { success: false, error: `Validation failed: ${errors}` }
  }
  return { success: true }
}
