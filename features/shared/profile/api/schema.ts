import { z } from 'zod'
import { PHONE_REGEX, LOCALE_REGEX } from '@/lib/validations/patterns'

export const profileUpdateSchema = z.object({
  full_name: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim()
    .optional(),
  phone: z.string()
    .regex(PHONE_REGEX, 'Please enter a valid phone number (E.164 format)')
    .or(z.literal(''))
    .optional()
    .nullable(),
  avatar_url: z.string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional()
    .nullable(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .trim()
    .optional()
    .or(z.literal(''))
    .nullable(),
  timezone: z.string()
    .min(1, 'Timezone is required')
    .optional(),
  locale: z.string()
    .regex(LOCALE_REGEX, 'Locale must be in format xx-YY (e.g., en-US)')
    .optional(),
})

export const profileMetadataSchema = z.object({
  preferences: z.record(z.string(), z.unknown()).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
})

export const avatarUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'Avatar must be less than 5MB',
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      {
        message: 'Avatar must be a JPEG, PNG, or WebP image',
      }
    ),
})

export const profileSchema = z.object({})
export type ProfileSchema = z.infer<typeof profileSchema>
export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>
export type ProfileMetadataSchema = z.infer<typeof profileMetadataSchema>
export type AvatarUploadSchema = z.infer<typeof avatarUploadSchema>
