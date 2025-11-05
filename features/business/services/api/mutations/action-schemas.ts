import { z } from 'zod'

/**
 * Service form schema - server-side validation
 * Validates all service fields from FormData
 *
 * NOTE: This file does NOT have 'use server' directive because Zod schemas
 * are not server actions - they are validation schemas used by server actions.
 */
export const serviceFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Service name must be at least 3 characters')
    .max(200, 'Service name must be 200 characters or fewer')
    .refine(
      (val) => /[a-zA-Z]/.test(val),
      'Service name must contain letters'
    ),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be 1000 characters or fewer')
    .optional()
    .transform(val => val || undefined),
  category_id: z
    .string()
    .uuid('Invalid category ID')
    .optional()
    .transform(val => val || undefined),
  base_price: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .max(99999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  duration_minutes: z.coerce
    .number()
    .int('Duration must be in whole minutes')
    .min(5, 'Service must be at least 5 minutes')
    .max(480, 'Service cannot exceed 8 hours'),
  buffer_minutes: z.coerce
    .number()
    .int('Buffer must be in whole minutes')
    .min(0, 'Buffer cannot be negative')
    .max(120, 'Buffer cannot exceed 2 hours')
    .default(0),
  is_online_booking_enabled: z.coerce
    .boolean()
    .default(true),
  requires_deposit: z.coerce
    .boolean()
    .default(false),
  deposit_amount: z.coerce
    .number()
    .min(0, 'Deposit cannot be negative')
    .max(99999.99, 'Deposit is too high')
    .multipleOf(0.01, 'Deposit must have at most 2 decimal places')
    .optional()
    .transform(val => val || undefined),
})
  .refine(
    (data) => {
      // If deposit is required, deposit amount must be set
      if (data.requires_deposit && !data.deposit_amount) {
        return false
      }
      return true
    },
    {
      message: 'Deposit amount is required when deposit is enabled',
      path: ['deposit_amount'],
    }
  )
  .refine(
    (data) => {
      // Deposit cannot exceed base price
      if (data.deposit_amount && data.deposit_amount > data.base_price) {
        return false
      }
      return true
    },
    {
      message: 'Deposit amount cannot exceed base price',
      path: ['deposit_amount'],
    }
  )
