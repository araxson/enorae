import { Section } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getPlatformAnalyticsSnapshot } from './api/queries'
import { PlatformAnalyticsDashboard } from './components/analytics-dashboard'

export async function AdminAnalytics() {
  try {
    const snapshot = await getPlatformAnalyticsSnapshot({ windowDays: 120 })
    return (
      <Section size=\"lg\">
        <PlatformAnalyticsDashboard snapshot={snapshot} />
      </Section>
    )
  } catch (error) {
    return (
      <Section size=\"lg\">
        <Alert variant=\"destructive\">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load analytics'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }
}
