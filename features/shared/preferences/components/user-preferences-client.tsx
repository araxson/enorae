'use client'

import { Stack } from '@/components/layout'
import { H2, Muted } from '@/components/ui/typography'
import { NotificationPreferencesForm } from './notification-preferences-form'
import { AdvancedPreferencesForm } from './advanced-preferences-form'
import type { Database } from '@/lib/types/database.types'

type ProfilePreference = Database['identity']['Tables']['profiles_preferences']['Row']

type NotificationSettings = {
  email_appointments?: boolean
  email_promotions?: boolean
  sms_reminders?: boolean
  push_enabled?: boolean
}

const parseNotificationPreferences = (value: ProfilePreference['preferences']): NotificationSettings => {
  if (!value || typeof value !== 'object') {
    return {}
  }
  const source = value as Record<string, unknown>
  const notifications = typeof source.notifications === 'object' && source.notifications !== null
    ? (source.notifications as Record<string, unknown>)
    : {}

  return {
    email_appointments: typeof notifications.email_appointments === 'boolean' ? notifications.email_appointments : undefined,
    email_promotions: typeof notifications.email_promotions === 'boolean' ? notifications.email_promotions : undefined,
    sms_reminders: typeof notifications.sms_reminders === 'boolean' ? notifications.sms_reminders : undefined,
    push_enabled: typeof notifications.push_enabled === 'boolean' ? notifications.push_enabled : undefined,
  }
}

type UserPreferencesClientProps = {
  initialPreferences: ProfilePreference[]
}

export function UserPreferencesClient({ initialPreferences }: UserPreferencesClientProps) {
  const firstPref = initialPreferences[0]

  const notificationPrefs = parseNotificationPreferences(firstPref?.preferences)
  const advancedPrefs = {
    timezone: firstPref?.timezone,
    locale: firstPref?.locale,
    currency_code: firstPref?.currency_code,
  }

  return (
    <div className="space-y-6">
      <div>
        <H2>User Preferences</H2>
        <Muted className="mt-1">
          Manage your personal preferences and settings
        </Muted>
      </div>

      <Stack gap="xl">
        <AdvancedPreferencesForm initialPreferences={advancedPrefs} />
        <NotificationPreferencesForm initialPreferences={notificationPrefs} />
      </Stack>
    </div>
  )
}
