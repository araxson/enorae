import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Profile metadata schema
 * For additional profile information (interests, tags, custom fields)
 */
export const profileMetadataSchema = z.object({
  bio: z.string().max(500, 'Bio must be 500 characters or fewer').optional(),
  interests: z
    .array(z.string().min(2, 'Interest must be at least 2 characters').max(50, 'Interest is too long'))
    .max(20, 'Maximum 20 interests allowed')
    .optional(),
  tags: z
    .array(z.string().min(2, 'Tag must be at least 2 characters').max(50, 'Tag is too long'))
    .max(30, 'Maximum 30 tags allowed')
    .optional(),
  social_links: z
    .object({
      facebook: z.string().url('Enter a valid Facebook URL').optional(),
      instagram: z.string().url('Enter a valid Instagram URL').optional(),
      twitter: z.string().url('Enter a valid Twitter URL').optional(),
      linkedin: z.string().url('Enter a valid LinkedIn URL').optional(),
      tiktok: z.string().url('Enter a valid TikTok URL').optional(),
      youtube: z.string().url('Enter a valid YouTube URL').optional(),
      website: z.string().url('Enter a valid website URL').optional(),
    })
    .optional(),
  custom_fields: z.record(z.string(), z.string()).optional(),
})

/**
 * Profile images schema
 * For uploading profile photo and cover photo
 */
export const profileImagesSchema = z.object({
  profile_photo_url: z.string().url('Enter a valid URL for profile photo').max(500, 'URL is too long').optional(),
  cover_photo_url: z.string().url('Enter a valid URL for cover photo').max(500, 'URL is too long').optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type ProfileMetadataSchema = z.infer<typeof profileMetadataSchema>
export type ProfileImagesSchema = z.infer<typeof profileImagesSchema>
