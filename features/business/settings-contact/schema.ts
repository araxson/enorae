import { z } from 'zod'

const phoneRegExp = /^[+0-9][0-9\s().-]{7,19}$/

const optionalPhone = z
  .union([
    z
      .string()
      .trim()
      .regex(phoneRegExp, 'Phone number must include 8-20 digits and may contain +, spaces, or dashes'),
    z.null(),
  ])
  .optional()

const optionalEmail = z
  .union([z.string().trim().email('Invalid email address'), z.null()])
  .optional()

const optionalUrl = z
  .union([z.string().trim().url('Invalid URL'), z.null()])
  .optional()

export const settingsContactSchema = z.object({
  primary_email: z.string().trim().email('Primary email is required'),
  booking_email: optionalEmail,
  primary_phone: optionalPhone,
  secondary_phone: optionalPhone,
  website_url: optionalUrl,
  booking_url: optionalUrl,
  facebook_url: optionalUrl,
  instagram_url: optionalUrl,
  twitter_url: optionalUrl,
  tiktok_url: optionalUrl,
  linkedin_url: optionalUrl,
  youtube_url: optionalUrl,
  whatsapp_number: optionalPhone,
  telegram_username: z
    .union([
      z
        .string()
        .trim()
        .min(3, 'Telegram username must be at least 3 characters')
        .max(32, 'Telegram username must be at most 32 characters')
        .regex(/^[A-Za-z0-9_]+$/, 'Telegram username can contain letters, numbers, and underscores only'),
      z.null(),
    ])
    .optional(),
  hours_display_text: z
    .union([
      z.string().trim().max(500, 'Hours description must be 500 characters or fewer'),
      z.null(),
    ])
    .optional(),
})

export type SettingsContactSchema = z.infer<typeof settingsContactSchema>
