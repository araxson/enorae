import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
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
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Notification Center</H1>
          <P className="text-muted-foreground">
            Monitor delivery health, manage templates, and configure automation preferences.
          </P>
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
          <P className="text-sm text-muted-foreground mb-4">
            Recent notifications and delivery statuses for auditing and troubleshooting.
          </P>
          <NotificationHistoryTable history={history} />
        </div>
      </Stack>
    </Section>
  )
}
