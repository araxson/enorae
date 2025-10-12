export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app'

export type NotificationPreferences = {
  appointments: NotificationChannel[]
  messages: NotificationChannel[]
  schedule_changes: NotificationChannel[]
  time_off_updates: NotificationChannel[]
  commission_updates: NotificationChannel[]
}

export type CommunicationPreferences = {
  allow_client_messages: boolean
  allow_team_messages: boolean
  auto_reply_enabled: boolean
  auto_reply_message: string | null
}

export type PrivacySettings = {
  profile_visible_to_clients: boolean
  show_ratings: boolean
  show_completed_appointments: boolean
  allow_profile_search: boolean
}

export type DisplayPreferences = {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  date_format: string
  time_format: '12h' | '24h'
}

export type UserPreferences = {
  notification_preferences: NotificationPreferences
  communication_preferences: CommunicationPreferences
  privacy_settings: PrivacySettings
  display_preferences: DisplayPreferences
}
