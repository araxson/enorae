import { z } from 'zod'

/**
 * Schema for newsletter subscription
 */
export const newsletterSubscriptionSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters')
    .describe('Subscriber email address'),
  source: z
    .string()
    .optional()
    .describe('Source of the subscription (e.g., homepage, footer, etc.)'),
})

export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>
