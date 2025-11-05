import { z } from 'zod'

/**
 * Staff form schemas - server-side validation
 */
export const createStaffFormSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .transform(val => val.toLowerCase().trim()),
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long')
    .transform(val => val.trim()),
  title: z
    .string()
    .max(100, 'Title too long')
    .optional()
    .transform(val => val?.trim() || undefined),
  bio: z
    .string()
    .max(1000, 'Bio too long')
    .optional()
    .transform(val => val?.trim() || undefined),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal(''))
    .transform(val => val || undefined),
  experience_years: z.coerce
    .number()
    .int('Experience must be whole years')
    .min(0, 'Experience years cannot be negative')
    .max(100, 'Experience years must be realistic')
    .optional()
    .transform(val => val || undefined),
})

export const updateStaffFormSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long')
    .transform(val => val.trim()),
  title: z
    .string()
    .max(100, 'Title too long')
    .optional()
    .transform(val => val?.trim() || undefined),
  bio: z
    .string()
    .max(1000, 'Bio too long')
    .optional()
    .transform(val => val?.trim() || undefined),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal(''))
    .transform(val => val || undefined),
  experience_years: z.coerce
    .number()
    .int('Experience must be whole years')
    .min(0, 'Experience years cannot be negative')
    .max(100, 'Experience years must be realistic')
    .optional()
    .transform(val => val || undefined),
})

