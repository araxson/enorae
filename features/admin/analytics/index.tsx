import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getPlatformAnalyticsSnapshot } from './api/queries'
import { PlatformAnalyticsDashboard } from './components'

// Export types
export type * from './types'

export async function AdminAnalytics() {
  try {
    const snapshot = await getPlatformAnalyticsSnapshot({ windowDays: 120 })
    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <PlatformAnalyticsDashboard snapshot={snapshot} />
        </div>
      </section>
    )
  } catch (error) {
    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTitle>Analytics unavailable</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load analytics'}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }
}
