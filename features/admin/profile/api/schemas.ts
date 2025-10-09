import { z } from 'zod'

export const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,32}$/

export const basicDetailsSchema = z.object({
  profileId: z.string().uuid(),
  fullName: z.string().trim().max(120).optional(),
  username: z
    .string()
    .trim()
    .regex(USERNAME_REGEX, 'Usernames must be 3-32 characters using letters, numbers, ".", "_" or "-"')
    .optional()
    .or(z.literal('')),
})

export const metadataSchema = z.object({
  profileId: z.string().uuid(),
  tags: z.array(z.string().trim().max(32)).max(15).optional(),
  interests: z.array(z.string().trim().max(32)).max(20).optional(),
  socialProfiles: z
    .record(z.string().trim().max(200))
    .optional(),
})

export const preferencesSchema = z.object({
  profileId: z.string().uuid(),
  timezone: z.string().trim().max(64).optional().or(z.literal('')),
  locale: z.string().trim().max(10).optional().or(z.literal('')),
  countryCode: z
    .string()
    .trim()
    .max(2)
    .optional()
    .or(z.literal('')),
  marketingEmails: z.boolean().optional(),
  smsAlerts: z.boolean().optional(),
})
