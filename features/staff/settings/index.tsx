import { Section, Stack } from '@/components/layout'
import { H1 } from '@/components/ui/typography'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationPreferences } from './components/notification-preferences'
import { PrivacySettings } from './components/privacy-settings'
import { DisplayPreferences } from './components/display-preferences'
import { getUserPreferences } from './api/queries'
import type { UserPreferences } from './types'

interface SettingsFeatureProps {
  preferences: UserPreferences
}

export function SettingsFeature({ preferences }: SettingsFeatureProps) {
  return (
    <Stack gap="lg">
      <H1>Settings & Preferences</H1>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <NotificationPreferences initialPreferences={preferences.notification_preferences} />
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <PrivacySettings initialSettings={preferences.privacy_settings} />
        </TabsContent>

        <TabsContent value="display" className="mt-6">
          <DisplayPreferences initialPreferences={preferences.display_preferences} />
        </TabsContent>
      </Tabs>
    </Stack>
  )
}

export async function StaffSettingsPage() {
  const preferences = await getUserPreferences()

  return (
    <Section size="lg">
      <SettingsFeature preferences={preferences} />
    </Section>
  )
}
