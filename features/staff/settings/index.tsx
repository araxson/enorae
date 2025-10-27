import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
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
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <CardTitle>Settings & Preferences</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
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

export async function StaffSettingsPage() {
  const preferences = await getUserPreferences()

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <SettingsFeature preferences={preferences} />
    </section>
  )
}
