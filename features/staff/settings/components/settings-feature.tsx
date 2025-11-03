import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationPreferences } from './notification-preferences'
import { PrivacySettings } from './privacy-settings'
import { DisplayPreferences } from './display-preferences'
import { getUserPreferences } from '../api/queries'
import type { UserPreferences } from '../api/types'

export async function SettingsFeature() {
  const preferences = await getUserPreferences()

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings & Preferences</CardTitle>
        </CardHeader>
      </Card>

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
    </div>
  )
}
