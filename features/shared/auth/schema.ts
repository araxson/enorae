import { z } from 'zod'

const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/\d/, 'Password must include at least one number')
  .regex(/[@$!%*?&#]/, 'Password must include at least one special character (@$!%*?&#)')

export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .transform((val) => val.toLowerCase().trim())

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .optional(),
})

export const otpSchema = z.object({
  email: emailSchema,
  token: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
})

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

export const passwordResetSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
})

export const authSchema = z.object({})
export type AuthSchema = z.infer<typeof authSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type OtpSchema = z.infer<typeof otpSchema>
export type PasswordResetRequestSchema = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>
