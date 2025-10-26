import { z } from 'zod'

export const salonSettingsSchema = z.object({
  is_accepting_bookings: z.boolean().default(true),
  booking_lead_time_hours: z.coerce.number()
    .int('Lead time must be a whole number')
    .min(0, 'Lead time cannot be negative')
    .max(720, 'Lead time cannot exceed 720 hours (30 days)')
    .nullable()
    .optional(),
  cancellation_hours: z.coerce.number()
    .int('Cancellation window must be a whole number')
    .min(0, 'Cancellation window cannot be negative')
    .max(168, 'Cancellation window cannot exceed 168 hours (7 days)')
    .nullable()
    .optional(),
  auto_confirm_bookings: z.boolean().default(false),
  require_deposit: z.boolean().default(false),
  deposit_percentage: z.coerce.number()
    .min(0, 'Deposit percentage cannot be negative')
    .max(100, 'Deposit percentage cannot exceed 100%')
    .nullable()
    .optional(),
  time_zone: z.string()
    .min(1, 'Time zone is required')
    .optional(),
  currency_code: z.string()
    .length(3, 'Currency code must be a 3-letter ISO code')
    .transform((code) => code.toUpperCase())
    .default('USD'),
  tax_rate: z.coerce.number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%')
    .nullable()
    .optional(),
}).refine(
  (data) => {
    if (data.require_deposit && !data.deposit_percentage) {
      return false
    }
    return true
  },
  {
    message: 'Deposit percentage is required when deposits are enabled',
    path: ['deposit_percentage'],
  }
)

export const settingsSchema = z.object({})
export type SettingsSchema = z.infer<typeof settingsSchema>
export type SalonSettingsSchema = z.infer<typeof salonSettingsSchema>
