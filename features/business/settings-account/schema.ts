import { z } from 'zod'

/**
 * Password update schema - SEC-M302
 * Validates password requirements before auth operations
 */
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must not exceed 72 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>

/**
 * Email update schema - SEC-M302
 * Validates email format before auth operations
 */
export const updateEmailSchema = z.object({
  newEmail: z.string().email('Invalid email address').max(255, 'Email too long'),
})

export type UpdateEmailSchema = z.infer<typeof updateEmailSchema>

/**
 * Profile update schema - SEC-M302
 * Validates profile fields before database writes
 */
export const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  avatar_url: z.string().url('Invalid avatar URL').optional().nullable(),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

/**
 * Two-factor auth schema - SEC-M302
 * Validates 2FA settings
 */
export const updateTwoFactorAuthSchema = z.object({
  enabled: z.boolean(),
})

export type UpdateTwoFactorAuthSchema = z.infer<typeof updateTwoFactorAuthSchema>

// Backward compatibility
export const settingsAccountSchema = z.object({})
export type SettingsAccountSchema = z.infer<typeof settingsAccountSchema>
