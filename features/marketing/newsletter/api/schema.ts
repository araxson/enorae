import { z } from 'zod'

/**
 * Newsletter subscription validation schema
 */
export const newsletterSubscriptionSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
  source: z.string().max(100, 'Source is too long').optional(),
})

/**
 * Inferred TypeScript type from schema
 */
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>
