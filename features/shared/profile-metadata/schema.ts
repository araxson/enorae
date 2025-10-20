import { z } from 'zod'

/**
 * Social profile schema - SEC-M302
 * Validates social media profile links
 */
const socialProfileSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url('Invalid URL'),
  username: z.string().min(1).max(100).optional(),
})

/**
 * Profile metadata update schema - SEC-M302
 * Validates all profile metadata fields before database writes
 */
export const profileMetadataSchema = z.object({
  avatar_url: z.string().url('Invalid avatar URL').max(2048).nullable().optional(),
  avatar_thumbnail_url: z.string().url('Invalid thumbnail URL').max(2048).nullable().optional(),
  cover_image_url: z.string().url('Invalid cover image URL').max(2048).nullable().optional(),
  social_profiles: z.array(socialProfileSchema).max(10, 'Maximum 10 social profiles').nullable().optional(),
  interests: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 interests').nullable().optional(),
  tags: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 tags').nullable().optional(),
})

export type ProfileMetadataSchema = z.infer<typeof profileMetadataSchema>

/**
 * File upload validation schema - SEC-M302
 * Validates file uploads for avatars and cover images
 */
export const avatarFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine((file) => file.type.startsWith('image/'), 'File must be an image')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'File must be JPEG, PNG, WebP, or GIF'
    ),
})

export type AvatarFileSchema = z.infer<typeof avatarFileSchema>

export const coverImageFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine((file) => file.type.startsWith('image/'), 'File must be an image')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'File must be JPEG, PNG, or WebP'
    ),
})

export type CoverImageFileSchema = z.infer<typeof coverImageFileSchema>
