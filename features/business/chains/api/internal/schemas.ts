import { z } from 'zod'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const chainSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  legal_name: z.string().max(200).optional().or(z.literal('')),
})

const optionalBoundedInt = (max: number, fieldLabel: string) =>
  z
    .preprocess(
      (value) => {
        if (value === undefined || value === null) return undefined
        if (typeof value === 'string') {
          const trimmed = value.trim()
          if (trimmed === '') return undefined
          const parsed = Number(trimmed)
          return Number.isFinite(parsed) ? parsed : Number.NaN
        }
        if (typeof value === 'number') return value
        return Number.NaN
      },
      z
        .number()
        .int(`${fieldLabel} must be a whole number`)
        .min(0, `${fieldLabel} cannot be negative`)
        .max(max, `${fieldLabel} cannot exceed ${max}`),
    )
    .optional()

const optionalBoolean = z
  .preprocess((value) => {
    if (value === undefined || value === null) return undefined
    if (typeof value === 'string') {
      if (value.trim() === '') return undefined
      if (value === 'true') return true
      if (value === 'false') return false
    }
    if (typeof value === 'boolean') return value
    return value
  }, z.boolean({ invalid_type_error: 'isAcceptingBookings must be true or false' }))
  .optional()

export const chainSettingsSchema = z.object({
  chainId: z.string().regex(UUID_REGEX, 'Invalid chain ID'),
  bookingLeadTimeHours: optionalBoundedInt(720, 'Booking lead time'),
  cancellationHours: optionalBoundedInt(168, 'Cancellation window'),
  isAcceptingBookings: optionalBoolean,
})
