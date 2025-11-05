import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AdminSection } from '@/features/admin/common/components'
import { getPlatformAnalyticsSnapshot } from './api/queries'
import { PlatformAnalyticsDashboard } from './components'

// Export types
export type * from './api/types'

export async function AdminAnalytics() {
  try {
    const snapshot = await getPlatformAnalyticsSnapshot({ windowDays: 120 })
    return (
      <AdminSection>
        <PlatformAnalyticsDashboard snapshot={snapshot} />
      </AdminSection>
    )
  } catch (error) {
    return (
      <AdminSection>
        <Alert variant="destructive">
          <AlertTitle>Analytics unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load analytics'}
          </AlertDescription>
        </Alert>
      </AdminSection>
    )
  }
}
