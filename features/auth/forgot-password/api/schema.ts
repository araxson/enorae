import { z } from 'zod'

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase().trim()),
})

export type PasswordResetInput = z.infer<typeof passwordResetRequestSchema>
