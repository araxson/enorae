import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase().trim()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type LoginInput = LoginSchema
