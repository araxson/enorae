/**
 * Newsletter validation schemas
 */

import { z } from 'zod'

/**
 * Newsletter email validation schema
 */
export const newsletterSubscriptionSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.string().optional(),
})

export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>
