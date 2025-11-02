export type PreferencesFormData = {
  timezone: string
  locale: string
  currency_code: string
  preferences: Record<string, unknown>
  emailNotifications: boolean
  smsNotifications: boolean
  email_notifications: boolean
  sms_notifications: boolean
  appointment_reminders: boolean
  marketing_emails: boolean
  marketingEmails: boolean
  reminderTime: number
}

export type ProfilePreferences = {
  timezone?: string
  locale?: string
  currency_code?: string
  preferences?: Record<string, unknown>
  emailNotifications?: boolean
  smsNotifications?: boolean
  email_notifications?: boolean
  sms_notifications?: boolean
  appointment_reminders?: boolean
  marketing_emails?: boolean
  marketingEmails?: boolean
  reminderTime?: number
}

export const defaultPreferencesFormData: Partial<PreferencesFormData> = {
  emailNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  reminderTime: 24,
  timezone: 'America/New_York',
  locale: 'en-US',
  currency_code: 'USD',
}

export function parsePreferences(data: unknown): Record<string, unknown> {
  if (typeof data !== 'object' || data === null) {
    return {
      email_notifications: true,
      sms_notifications: false,
      appointment_reminders: true,
      marketing_emails: false,
    }
  }

  return data as Record<string, unknown>
}
