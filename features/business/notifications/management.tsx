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
import { CardTitle, CardDescription } from '@/components/ui/card'

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
        <div>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>
            Monitor delivery health, manage templates, and configure automation preferences.
          </CardDescription>
        </div>

        <NotificationOverviewCards
          totals={stats.totals}
          failureRate={stats.failureRate}
          channels={stats.channels}
        />

        <NotificationPreviewPanel templates={templates} />

        <NotificationTemplatesManager templates={templates} />

        <NotificationPreferencesForm preferences={preferences} />

        <div>
          <CardTitle>Delivery History</CardTitle>
          <CardDescription>
            Recent notifications and delivery statuses for auditing and troubleshooting.
          </CardDescription>
          <NotificationHistoryTable history={history} />
        </div>
      </div>
    </section>
  )
}
