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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
            <CardTitle>Notification center</CardTitle>
            <CardDescription>
              Monitor delivery health, manage templates, and configure automation preferences.
            </CardDescription>
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
            <CardTitle>Delivery history</CardTitle>
            <CardDescription>
              Recent notifications and delivery statuses for auditing and troubleshooting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationHistoryTable history={history} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
