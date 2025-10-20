import type { Database } from '@/lib/types/database.types'

export type ProfilePreferences = Database['public']['Views']['profiles_preferences']['Row']

export type PreferenceSettings = {
  email_notifications?: boolean
  sms_notifications?: boolean
  appointment_reminders?: boolean
  marketing_emails?: boolean
}

export interface ProfilePreferencesEditorProps {
  preferences: ProfilePreferences | null
}

export const parsePreferences = (value: ProfilePreferences['preferences'] | undefined): PreferenceSettings => {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const source = value as Record<string, unknown>
  return {
    email_notifications: typeof source.email_notifications === 'boolean' ? source.email_notifications : undefined,
    sms_notifications: typeof source.sms_notifications === 'boolean' ? source.sms_notifications : undefined,
    appointment_reminders: typeof source.appointment_reminders === 'boolean' ? source.appointment_reminders : undefined,
    marketing_emails: typeof source.marketing_emails === 'boolean' ? source.marketing_emails : undefined,
  }
}
