/**
 * Newsletter subscription types
 */

export interface NewsletterSubscriptionRequest {
  email: string
  source?: string
}

export interface NewsletterSubscriptionResponse {
  success: boolean
  error?: string
}
