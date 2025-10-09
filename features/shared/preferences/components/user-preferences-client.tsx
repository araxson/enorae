'use client'

import { Stack } from '@/components/layout'
import { H2, Muted } from '@/components/ui/typography'
import { NotificationPreferencesForm } from './notification-preferences-form'
import { AdvancedPreferencesForm } from './advanced-preferences-form'
import type { Database } from '@/lib/types/database.types'

type ProfilePreference = Database['identity']['Tables']['profiles_preferences']['Row']

type UserPreferencesClientProps = {
  initialPreferences: ProfilePreference[]
}

export function UserPreferencesClient({ initialPreferences }: UserPreferencesClientProps) {
  const firstPref = initialPreferences[0]

  const notificationPrefs = {
    email_appointments: (firstPref?.preferences as any)?.notifications?.email_appointments,
    email_promotions: (firstPref?.preferences as any)?.notifications?.email_promotions,
    sms_reminders: (firstPref?.preferences as any)?.notifications?.sms_reminders,
    push_enabled: (firstPref?.preferences as any)?.notifications?.push_enabled,
  }

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
