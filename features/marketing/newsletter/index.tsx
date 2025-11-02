/**
 * Newsletter subscription feature
 * Handles email subscription signup and management
 */

export { subscribeToNewsletter } from './api/mutations'
export { newsletterSubscriptionSchema } from './schema'
export type { NewsletterSubscriptionInput } from './schema'
export type { NewsletterSubscriptionRequest, NewsletterSubscriptionResponse } from './types'
export { NewsletterForm } from '@/features/marketing/common-components'
export * from './types'
