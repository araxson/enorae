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
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Notification Center</h1>
          <p className="leading-7 text-muted-foreground">
            Monitor delivery health, manage templates, and configure automation preferences.
          </p>
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
          <h2 className="text-2xl font-semibold mb-2">Delivery History</h2>
          <p className="leading-7 text-sm text-muted-foreground mb-4">
            Recent notifications and delivery statuses for auditing and troubleshooting.
          </p>
          <NotificationHistoryTable history={history} />
        </div>
      </div>
    </section>
  )
}
