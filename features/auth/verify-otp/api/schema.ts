import { z } from 'zod'

export const otpSchema = z.object({
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase().trim()),
  token: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must contain only digits'),
})

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase().trim()),
})

export type OTPInput = z.infer<typeof otpSchema>
export type ResendOTPInput = z.infer<typeof resendOtpSchema>
