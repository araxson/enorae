import { z } from 'zod'

/**
 * Theme mode enumeration
 */
export const themeModeEnum = z.enum(['light', 'dark', 'system'])

/**
 * Date format enumeration
 */
export const dateFormatEnum = z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'])

/**
 * Time format enumeration
 */
export const timeFormatEnum = z.enum(['12h', '24h'])

/**
 * Language code enumeration (ISO 639-1)
 */
export const languageCodeEnum = z.enum(['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'zh', 'ja', 'ko'])

/**
 * User preferences schema
 * Controls display preferences, notifications, and other settings
 */
export const userPreferencesSchema = z.object({
  // Appearance
  theme: themeModeEnum.default('system'),
  date_format: dateFormatEnum.default('MM/DD/YYYY'),
  time_format: timeFormatEnum.default('12h'),
  language: languageCodeEnum.default('en'),
  timezone: z.string().min(1, 'Timezone is required'),

  // Email notifications
  email_notifications_enabled: z.boolean().default(true),
  email_appointment_reminders: z.boolean().default(true),
  email_booking_confirmations: z.boolean().default(true),
  email_cancellations: z.boolean().default(true),
  email_promotions: z.boolean().default(false),
  email_newsletters: z.boolean().default(false),
  email_weekly_digest: z.boolean().default(false),

  // SMS notifications
  sms_notifications_enabled: z.boolean().default(false),
  sms_appointment_reminders: z.boolean().default(false),
  sms_booking_confirmations: z.boolean().default(false),

  // Push notifications
  push_notifications_enabled: z.boolean().default(true),
  push_appointment_reminders: z.boolean().default(true),
  push_messages: z.boolean().default(true),
  push_reviews: z.boolean().default(true),

  // Privacy
  profile_visibility: z.enum(['public', 'private', 'contacts_only']).default('public'),
  show_email_publicly: z.boolean().default(false),
  show_phone_publicly: z.boolean().default(false),
  allow_search_engines: z.boolean().default(true),

  // Communication
  allow_promotional_messages: z.boolean().default(false),
  allow_review_requests: z.boolean().default(true),
  allow_feedback_surveys: z.boolean().default(true),

  // Accessibility
  high_contrast_mode: z.boolean().default(false),
  reduce_animations: z.boolean().default(false),
  large_text: z.boolean().default(false),
  screen_reader_optimized: z.boolean().default(false),
})

/**
 * Advanced preferences schema
 * For power users and advanced settings
 */
export const advancedPreferencesSchema = z.object({
  // Data and privacy
  data_retention_days: z.coerce
    .number()
    .int('Must be whole days')
    .min(30, 'Minimum 30 days retention')
    .max(365, 'Maximum 365 days retention')
    .default(90),
  export_data_format: z.enum(['json', 'csv', 'pdf']).default('json'),
  enable_analytics_tracking: z.boolean().default(true),
  enable_performance_tracking: z.boolean().default(true),

  // Booking preferences
  default_booking_duration: z.coerce
    .number()
    .int('Duration must be in whole minutes')
    .min(15, 'Minimum 15 minutes')
    .max(480, 'Maximum 8 hours')
    .default(60),
  auto_cancel_unconfirmed_hours: z.coerce
    .number()
    .int('Must be whole hours')
    .min(1, 'Minimum 1 hour')
    .max(168, 'Maximum 7 days')
    .default(24),
  require_deposit: z.boolean().default(false),

  // Calendar preferences
  calendar_start_day: z.coerce
    .number()
    .int('Must be a whole number')
    .min(0, 'Sunday is 0')
    .max(6, 'Saturday is 6')
    .default(0),
  calendar_view: z.enum(['day', 'week', 'month', 'agenda']).default('week'),
  show_weekends: z.boolean().default(true),

  // Interface preferences
  sidebar_collapsed: z.boolean().default(false),
  compact_mode: z.boolean().default(false),
  show_onboarding_tips: z.boolean().default(true),
  keyboard_shortcuts_enabled: z.boolean().default(true),

  // Auto-save and backups
  auto_save_enabled: z.boolean().default(true),
  auto_save_interval_seconds: z.coerce
    .number()
    .int('Must be whole seconds')
    .min(10, 'Minimum 10 seconds')
    .max(300, 'Maximum 5 minutes')
    .default(30),
})

/**
 * Notification timing preferences schema
 * Controls when notifications are sent
 */
export const notificationTimingSchema = z.object({
  quiet_hours_enabled: z.boolean().default(false),
  quiet_hours_start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format').optional(),
  quiet_hours_end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format').optional(),
  appointment_reminder_hours: z.coerce
    .number()
    .int('Must be whole hours')
    .min(1, 'Minimum 1 hour')
    .max(168, 'Maximum 7 days')
    .default(24),
  second_reminder_enabled: z.boolean().default(false),
  second_reminder_hours: z.coerce
    .number()
    .int('Must be whole hours')
    .min(1, 'Minimum 1 hour')
    .max(72, 'Maximum 3 days')
    .optional(),
}).refine(
  (data) => {
    // If quiet hours enabled, both start and end times required
    if (data.quiet_hours_enabled && (!data.quiet_hours_start || !data.quiet_hours_end)) {
      return false
    }
    return true
  },
  {
    message: 'Quiet hours start and end times are required when enabled',
    path: ['quiet_hours_start'],
  }
).refine(
  (data) => {
    // If second reminder enabled, hours must be set
    if (data.second_reminder_enabled && !data.second_reminder_hours) {
      return false
    }
    return true
  },
  {
    message: 'Second reminder hours required when second reminder is enabled',
    path: ['second_reminder_hours'],
  }
)

/**
 * Inferred TypeScript types from schemas
 */
export type UserPreferencesSchema = z.infer<typeof userPreferencesSchema>
export type AdvancedPreferencesSchema = z.infer<typeof advancedPreferencesSchema>
export type NotificationTimingSchema = z.infer<typeof notificationTimingSchema>
