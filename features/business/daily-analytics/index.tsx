import { subDays, format } from 'date-fns'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { BarChart3, Store } from 'lucide-react'
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
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Store className="h-8 w-8" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No salon found</EmptyTitle>
            <EmptyDescription>Please create a salon profile to view analytics.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>Set up your first location to unlock reporting insights.</EmptyContent>
        </Empty>
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
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BarChart3 className="h-8 w-8" aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No data available</EmptyTitle>
                <EmptyDescription>
                  No data available for this date range. Metrics are collected daily.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>Try expanding the date range or enabling data collection.</EmptyContent>
            </Empty>
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
