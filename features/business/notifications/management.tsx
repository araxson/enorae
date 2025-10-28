import {
  getNotificationHistory,
  getNotificationPreferences,
  getNotificationStatistics,
  getNotificationTemplates,
} from './api/queries'
import { NotificationOverviewCards } from './components/notification-overview-cards'
import { NotificationHistoryTable } from './components/notification-history-table'
import { NotificationTemplatesManager } from './components/notification-templates-manager'
import { NotificationPreferencesForm } from './components/notification-preferences-form'
import { NotificationPreviewPanel } from './components/notification-preview-panel'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

export async function BusinessNotificationManagement() {
  const [history, stats, templates, preferences] = await Promise.all([
    getNotificationHistory(100),
    getNotificationStatistics(),
    getNotificationTemplates(),
    getNotificationPreferences(),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item className="flex-col items-start gap-1">
                <ItemContent>
                  <ItemTitle>Notification center</ItemTitle>
                </ItemContent>
                <ItemContent>
                  <ItemDescription>
                    Monitor delivery health, manage templates, and configure automation preferences.
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
        </Card>

        <NotificationOverviewCards
          totals={stats.totals}
          failureRate={stats.failureRate}
          channels={stats.channels}
        />

        <NotificationPreviewPanel templates={templates} />

        <NotificationTemplatesManager templates={templates} />

        <NotificationPreferencesForm preferences={preferences} />

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item className="flex-col items-start gap-1">
                <ItemContent>
                  <ItemTitle>Delivery history</ItemTitle>
                </ItemContent>
                <ItemContent>
                  <ItemDescription>
                    Recent notifications and delivery statuses for auditing and troubleshooting.
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <NotificationHistoryTable history={history} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
