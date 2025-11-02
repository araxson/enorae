import { z } from 'zod'

/**
 * Password validation schema with strength requirements
 * Meets security best practices for passwords
 */
export const passwordSchema = z
  .object({
    current_password: z.string().min(8, 'Current password is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
    confirm_password: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

/**
 * Account information schema
 * Basic account details like name and email
 */
export const accountInfoSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string().email('Enter a valid email address').transform((val) => val.toLowerCase().trim()),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number (E.164 format)')
    .optional()
    .or(z.literal('')),
  timezone: z.string().min(1, 'Please select a timezone').optional(),
  language: z.string().length(2, 'Language must be a 2-letter code (e.g., en, fr)').default('en'),
})

/**
 * Billing information schema
 * Payment and billing details
 */
export const billingInfoSchema = z.object({
  billing_name: z.string().min(2, 'Billing name is required').max(100, 'Billing name is too long'),
  billing_email: z.string().email('Enter a valid billing email').transform((val) => val.toLowerCase().trim()),
  billing_address_line1: z.string().min(5, 'Street address is required').max(200, 'Address is too long'),
  billing_address_line2: z.string().max(200, 'Address is too long').optional(),
  billing_city: z.string().min(2, 'City is required').max(100, 'City name is too long'),
  billing_state: z.string().min(2, 'State/Province is required').max(100, 'State name is too long'),
  billing_postal_code: z.string().min(3, 'Postal code is required').max(20, 'Postal code is too long'),
  billing_country: z
    .string()
    .length(2, 'Country must be a 2-letter code (e.g., US, GB)')
    .regex(/^[A-Z]{2}$/, 'Country must be uppercase 2-letter code'),
  tax_id: z.string().max(50, 'Tax ID is too long').optional(),
})

/**
 * Subscription management schema
 * For updating subscription plans and preferences
 */
export const subscriptionSchema = z.object({
  plan_id: z.string().min(1, 'Please select a subscription plan'),
  billing_cycle: z.enum(['monthly', 'yearly']),
  auto_renew: z.boolean().default(true),
  payment_method_id: z.string().min(1, 'Please select a payment method').optional(),
})

/**
 * Payment method schema
 * For adding/updating credit cards or payment methods
 */
export const paymentMethodSchema = z.object({
  type: z.enum(['credit_card', 'debit_card', 'bank_account']),
  cardholder_name: z.string().min(2, 'Cardholder name is required').max(100, 'Name is too long'),
  card_number: z
    .string()
    .regex(/^\d{13,19}$/, 'Enter a valid card number (13-19 digits)')
    .transform((val) => val.replace(/\s/g, '')), // Remove spaces
  expiry_month: z.coerce
    .number()
    .int('Month must be a whole number')
    .min(1, 'Month must be between 1 and 12')
    .max(12, 'Month must be between 1 and 12'),
  expiry_year: z.coerce
    .number()
    .int('Year must be a whole number')
    .min(new Date().getFullYear(), 'Card has expired')
    .max(new Date().getFullYear() + 20, 'Expiry year too far in the future'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  is_default: z.boolean().default(false),
}).refine(
  (data) => {
    // Validate that card hasn't expired
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // 0-indexed

    if (data.expiry_year < currentYear) return false
    if (data.expiry_year === currentYear && data.expiry_month < currentMonth) return false

    return true
  },
  {
    message: 'Card has expired',
    path: ['expiry_year'],
  }
)

/**
 * Account deletion schema
 * Requires confirmation for account deletion
 */
export const accountDeletionSchema = z.object({
  confirmation: z.literal('DELETE', 'Please type DELETE to confirm'),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)').max(1000, 'Reason is too long'),
  password: z.string().min(8, 'Please enter your password to confirm'),
})

/**
 * Notification preferences schema
 * Controls email and push notifications
 */
export const notificationPreferencesSchema = z.object({
  email_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  push_notifications: z.boolean().default(true),
  marketing_emails: z.boolean().default(false),
  appointment_reminders: z.boolean().default(true),
  booking_confirmations: z.boolean().default(true),
  cancellation_alerts: z.boolean().default(true),
  review_notifications: z.boolean().default(true),
  promotional_offers: z.boolean().default(false),
})

/**
 * Inferred TypeScript types from schemas
 */
export type PasswordSchema = z.infer<typeof passwordSchema>
export type AccountInfoSchema = z.infer<typeof accountInfoSchema>
export type BillingInfoSchema = z.infer<typeof billingInfoSchema>
export type SubscriptionSchema = z.infer<typeof subscriptionSchema>
export type PaymentMethodSchema = z.infer<typeof paymentMethodSchema>
export type AccountDeletionSchema = z.infer<typeof accountDeletionSchema>
export type NotificationPreferencesSchema = z.infer<typeof notificationPreferencesSchema>
