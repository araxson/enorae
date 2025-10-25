import { subDays, format } from 'date-fns'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DailyMetricsDashboard } from './components/daily-metrics-dashboard'
import { getUserSalon } from '@/features/business/staff/api/queries'
import { getDailyMetrics, getMetricsComparison } from './api/queries'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DailyAnalyticsProps {
  dateFrom?: string
  dateTo?: string
}

export async function DailyAnalytics({ dateFrom, dateTo }: DailyAnalyticsProps = {}) {
  // Default to last 30 days
  const today = new Date()
  const thirtyDaysAgo = subDays(today, 30)

  const currentDateFrom = dateFrom || format(thirtyDaysAgo, 'yyyy-MM-dd')
  const currentDateTo = dateTo || format(today, 'yyyy-MM-dd')

  // Calculate previous period (same length as current)
  const daysDiff = Math.ceil(
    (new Date(currentDateTo).getTime() - new Date(currentDateFrom).getTime()) / (1000 * 60 * 60 * 24)
  )
  const previousDateFrom = format(subDays(new Date(currentDateFrom), daysDiff + 1), 'yyyy-MM-dd')
  const previousDateTo = format(subDays(new Date(currentDateFrom), 1), 'yyyy-MM-dd')

  let salon
  try {
    salon = await getUserSalon()
  } catch (error) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert>
          <AlertTitle>Analytics unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view analytics'}
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  if (!salon?.id) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert>
          <AlertTitle>No salon found</AlertTitle>
          <AlertDescription>No salon found</AlertDescription>
        </Alert>
      </section>
    )
  }

  try {
    const [metrics, comparison] = await Promise.all([
      getDailyMetrics(salon.id, currentDateFrom, currentDateTo),
      getMetricsComparison(
        salon.id,
        currentDateFrom,
        currentDateTo,
        previousDateFrom,
        previousDateTo
      ),
    ])

    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Daily analytics</CardTitle>
              <CardDescription>
                Performance metrics from {currentDateFrom} to {currentDateTo}
              </CardDescription>
            </CardHeader>
          </Card>

          {metrics.length === 0 ? (
            <Alert>
              <AlertTitle>No data available</AlertTitle>
              <AlertDescription>
                No data available for this date range. Metrics are collected daily.
              </AlertDescription>
            </Alert>
          ) : (
            <DailyMetricsDashboard
              metrics={metrics}
              aggregated={comparison.current}
              trends={comparison.trends}
            />
          )}
        </div>
      </section>
    )
  } catch (error) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert>
          <AlertTitle>Failed to load analytics</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load analytics'}
          </AlertDescription>
        </Alert>
      </section>
    )
  }
}
