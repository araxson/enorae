/**
 * Newsletter subscription feature
 * Handles email subscription signup and management
 */

export { subscribeToNewsletter } from './api/mutations'
export { newsletterSubscriptionSchema } from './api/schema'
export type { NewsletterSubscriptionInput } from './api/schema'
export type { NewsletterSubscriptionRequest, NewsletterSubscriptionResponse } from './api/types'
export { NewsletterForm } from '@/features/marketing/components/common'
export type * from './api/types'
