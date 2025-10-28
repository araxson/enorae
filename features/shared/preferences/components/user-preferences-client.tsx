'use client'
import { NotificationPreferencesForm } from './notification-preferences-form'
import { AdvancedPreferencesForm } from './advanced-preferences-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Database } from '@/lib/types/database.types'

type ProfilePreference = Database['identity']['Tables']['profiles_preferences']['Row']

type NotificationSettings = {
  email_appointments?: boolean
  email_promotions?: boolean
  sms_reminders?: boolean
  push_enabled?: boolean
}

const parseNotificationPreferences = (value: ProfilePreference['preferences'] | undefined): NotificationSettings => {
  if (!value || typeof value !== 'object') {
    return {}
  }
  const source = value as Record<string, unknown>
  const notifications = typeof source['notifications'] === 'object' && source['notifications'] !== null
    ? (source['notifications'] as Record<string, unknown>)
    : {}

  return {
    email_appointments: typeof notifications['email_appointments'] === 'boolean' ? notifications['email_appointments'] : undefined,
    email_promotions: typeof notifications['email_promotions'] === 'boolean' ? notifications['email_promotions'] : undefined,
    sms_reminders: typeof notifications['sms_reminders'] === 'boolean' ? notifications['sms_reminders'] : undefined,
    push_enabled: typeof notifications['push_enabled'] === 'boolean' ? notifications['push_enabled'] : undefined,
  }
}

type UserPreferencesClientProps = {
  initialPreferences: ProfilePreference[]
}

export function UserPreferencesClient({ initialPreferences }: UserPreferencesClientProps) {
  const firstPref = initialPreferences[0]

  const notificationPrefs = parseNotificationPreferences(firstPref?.['preferences'])
  const advancedPrefs = {
    timezone: firstPref?.['timezone'],
    locale: firstPref?.['locale'],
    currency_code: firstPref?.['currency_code'],
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="scroll-m-20 text-3xl font-semibold">User Preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal preferences and settings
        </p>
      </div>

      <div className="w-full">
        <Tabs defaultValue="advanced">
          <div className="grid w-full grid-cols-2">
            <TabsList>
              <TabsTrigger value="advanced">Regional & Locale</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="advanced">
            <div className="mt-6">
              <AdvancedPreferencesForm initialPreferences={advancedPrefs} />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="mt-6">
              <NotificationPreferencesForm initialPreferences={notificationPrefs} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
