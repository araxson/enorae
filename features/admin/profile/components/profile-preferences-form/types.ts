import type { ProfileDetail } from '@/features/admin/profile/api/types'

/**
 * Profile preferences form component props
 */
export interface ProfilePreferencesFormProps {
  profile: ProfileDetail | null
  onUpdated: () => Promise<void>
}

/**
 * Form state for profile preferences
 */
export interface PreferencesFormState {
  timezone: string
  locale: string
  countryCode: string
  marketingEmails: boolean
  smsAlerts: boolean
}
