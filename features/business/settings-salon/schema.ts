import { z } from 'zod'

const optionalEstablishedDate = z
  .union([z.coerce.date(), z.literal('')])
  .transform((value) => (value instanceof Date ? value : undefined))
  .optional()

export const settingsSalonSchema = z.object({
  business_name: z
    .string()
    .trim()
    .min(1, 'Business name is required')
    .max(200, 'Business name must be 200 characters or fewer'),
  business_type: z
    .string()
    .trim()
    .max(100, 'Business type must be 100 characters or fewer')
    .optional()
    .transform((value) => (value && value.length ? value : undefined)),
  established_at: optionalEstablishedDate,
})

export type SettingsSalonSchema = z.infer<typeof settingsSalonSchema>
