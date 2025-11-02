import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Notification channel enumeration
 */
export const notificationChannelEnum = z.enum(['email', 'sms', 'push', 'in_app'])


/**
 * Notification type enumeration
 */
export const notificationTypeEnum = z.enum([
  'appointment_reminder',
  'appointment_confirmation',
  'appointment_cancellation',
  'appointment_rescheduled',
  'booking_request',
  'review_request',
  'promotional',
  'system',
  'custom',
])


/**
 * Notification priority enumeration
 */
export const notificationPriorityEnum = z.enum(['low', 'normal', 'high', 'urgent'])


/**
 * Notification preferences schema
 * Controls which notifications a user receives
 */
export const notificationPreferencesSchema = z.object({
  // Email notifications
  email_enabled: z.boolean().default(true),
  email_appointment_reminders: z.boolean().default(true),
  email_appointment_confirmations: z.boolean().default(true),
  email_booking_requests: z.boolean().default(true),
  email_cancellations: z.boolean().default(true),
  email_review_requests: z.boolean().default(true),
  email_promotions: z.boolean().default(false),
  email_marketing: z.boolean().default(false),

  // SMS notifications
  sms_enabled: z.boolean().default(false),
  sms_appointment_reminders: z.boolean().default(false),
  sms_appointment_confirmations: z.boolean().default(false),
  sms_booking_requests: z.boolean().default(false),
  sms_cancellations: z.boolean().default(false),

  // Push notifications
  push_enabled: z.boolean().default(true),
  push_appointment_reminders: z.boolean().default(true),
  push_appointment_confirmations: z.boolean().default(true),
  push_booking_requests: z.boolean().default(true),
  push_cancellations: z.boolean().default(true),
  push_reviews: z.boolean().default(true),
  push_messages: z.boolean().default(true),

  // In-app notifications
  in_app_enabled: z.boolean().default(true),
  in_app_appointment_updates: z.boolean().default(true),
  in_app_booking_requests: z.boolean().default(true),
  in_app_messages: z.boolean().default(true),
  in_app_system: z.boolean().default(true),

  // Timing preferences
  quiet_hours_enabled: z.boolean().default(false),
  quiet_hours_start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format').optional(),
  quiet_hours_end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format').optional(),

  // Reminder timing
  appointment_reminder_hours: z.coerce
    .number()
    .int('Must be whole hours')
    .min(1, 'Must be at least 1 hour')
    .max(168, 'Cannot exceed 7 days')
    .default(24),
})

/**
 * Notification template schema
 * For creating custom notification templates
 */
export const notificationTemplateSchema = z.object({
  name: z.string().min(3, 'Template name must be at least 3 characters').max(200, 'Name is too long'),
  notification_type: notificationTypeEnum,
  channel: notificationChannelEnum,
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject is too long').optional(),
  body_template: z
    .string()
    .min(10, 'Body must be at least 10 characters')
    .max(5000, 'Body must be 5000 characters or fewer')
    .refine(
      (val) => {
        // Ensure template contains at least one variable placeholder
        return /\{\{[a-zA-Z0-9_]+\}\}/.test(val)
      },
      {
        message: 'Template must contain at least one variable placeholder (e.g., {{customer_name}})',
      }
    ),
  is_active: z.boolean().default(true),
  is_default: z.boolean().default(false),
  variables: z
    .array(
      z.object({
        name: z.string().min(1, 'Variable name is required'),
        description: z.string().max(200, 'Description is too long').optional(),
        example: z.string().max(100, 'Example is too long').optional(),
      })
    )
    .max(20, 'Maximum 20 variables allowed')
    .optional(),
  send_at_offset_minutes: z.coerce
    .number()
    .int('Offset must be whole minutes')
    .min(-10080, 'Cannot be more than 7 days before')
    .max(10080, 'Cannot be more than 7 days after')
    .optional(),
})

/**
 * Send notification schema
 * For manually sending notifications
 */
export const sendNotificationSchema = z.object({
  recipient_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid recipient ID'))
    .min(1, 'At least one recipient is required')
    .max(1000, 'Cannot send to more than 1000 recipients at once'),
  notification_type: notificationTypeEnum,
  channel: notificationChannelEnum,
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject is too long').optional(),
  body: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
  priority: notificationPriorityEnum.default('normal'),
  schedule_at: z
    .string()
    .datetime('Invalid datetime format')
    .refine(
      (date) => {
        const scheduleDate = new Date(date)
        const now = new Date()
        return scheduleDate > now
      },
      {
        message: 'Schedule time must be in the future',
      }
    )
    .optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

/**
 * Bulk notification schema
 * For sending the same notification to multiple recipients
 */
export const bulkNotificationSchema = z.object({
  filter: z.object({
    customer_ids: z.array(z.string().regex(UUID_REGEX, 'Invalid customer ID')).optional(),
    has_upcoming_appointment: z.boolean().optional(),
    last_visit_days_ago: z.coerce.number().int().min(0).max(365).optional(),
    total_visits_min: z.coerce.number().int().min(0).optional(),
    tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
  }),
  notification_type: notificationTypeEnum,
  channel: notificationChannelEnum,
  subject: z.string().min(5, 'Subject is required').max(200, 'Subject is too long').optional(),
  body: z.string().min(10, 'Message is required').max(5000, 'Message is too long'),
  priority: notificationPriorityEnum.default('normal'),
  schedule_at: z.string().datetime('Invalid datetime format').optional(),
  exclude_opted_out: z.boolean().default(true),
})

/**
 * Notification test schema
 * For testing notification templates before sending
 */
export const notificationTestSchema = z.object({
  template_id: z.string().regex(UUID_REGEX, 'Invalid template ID'),
  channel: notificationChannelEnum,
  test_recipient_email: z.string().email('Enter a valid email address').optional(),
  test_recipient_phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number')
    .optional(),
  sample_data: z.record(z.string(), z.string()).optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type NotificationPreferencesSchema = z.infer<typeof notificationPreferencesSchema>
export type NotificationTemplateSchema = z.infer<typeof notificationTemplateSchema>
export type SendNotificationSchema = z.infer<typeof sendNotificationSchema>
export type BulkNotificationSchema = z.infer<typeof bulkNotificationSchema>
export type NotificationTestSchema = z.infer<typeof notificationTestSchema>
