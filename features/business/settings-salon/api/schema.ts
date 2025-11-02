import { z } from 'zod'

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
    .optional(),
  established_at: z.date().optional(),
})

export type SettingsSalonSchema = z.infer<typeof settingsSalonSchema>
