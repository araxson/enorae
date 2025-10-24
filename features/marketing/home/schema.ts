import { z } from 'zod'

export const newsletterSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  source: z.string().optional(),
})

export type NewsletterSchema = z.infer<typeof newsletterSchema>
