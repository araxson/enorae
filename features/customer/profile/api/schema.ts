import { z } from 'zod'

const timezonePattern = /^[A-Za-z0-9_\/+\-]+$/
const localePattern = /^[a-z]{2}-[A-Z]{2}$/
const currencyPattern = /^[A-Z]{3}$/

const optionalTrimmedString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed.length === 0 ? null : trimmed
  })

export const profilePreferencesFormSchema = z.object({
  timezone: optionalTrimmedString.refine(
    (value) => value === null || timezonePattern.test(value),
    { message: 'Invalid timezone format' },
  ),
  locale: optionalTrimmedString.refine(
    (value) => value === null || localePattern.test(value),
    { message: 'Locale must be in the format xx-YY' },
  ),
  currencyCode: optionalTrimmedString.refine(
    (value) => value === null || currencyPattern.test(value),
    { message: 'Currency code must be a 3-letter ISO code' },
  ),
  preferencesJson: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => (typeof value === 'string' ? value : null)),
})

export const preferenceSettingsSchema = z
  .object({
    email_notifications: z.boolean().optional(),
    sms_notifications: z.boolean().optional(),
    appointment_reminders: z.boolean().optional(),
    marketing_emails: z.boolean().optional(),
  })
  .default({})

export type ProfilePreferencesFormInput = z.infer<typeof profilePreferencesFormSchema>
export type ProfilePreferenceSettings = z.infer<typeof preferenceSettingsSchema>
